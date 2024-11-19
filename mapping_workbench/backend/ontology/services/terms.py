import re
from typing import List, Dict

import rdflib
from beanie import PydanticObjectId
from beanie.odm.operators.update.general import Set

from mapping_workbench.backend.ontology.adapters import invert_dict
from mapping_workbench.backend.ontology.adapters.namespace_handler import NamespaceInventory, \
    NamespaceInventoryException
from mapping_workbench.backend.ontology.models.namespace import Namespace
from mapping_workbench.backend.ontology.models.term import Term, TermValidityResponse, TermType
from mapping_workbench.backend.ontology.services.namespaces import discover_and_save_prefix_namespace, get_ns_handler, \
    get_custom_prefixes_definitions, get_project_ns_definitions, get_namespace_by_uri, \
    get_default_prefixes_definitions, get_prefixes_definitions
from mapping_workbench.backend.ontology_suite.adapters.ontology_file_beanie_repository import \
    OntologyFileResourceBeanieRepository
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResource
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User

# EPO_OWL_SOURCE_CONTENT = \
#     'https://raw.githubusercontent.com/OP-TED/ePO/master/implementation/ePO_core/owl_ontology/ePO_core.ttl'
# EPO_SHACL_SHAPES_FILE_URL = \
#     'https://raw.githubusercontent.com/OP-TED/ePO/master/implementation/ePO_core/shacl_shapes/ePO_core_shapes.ttl'

QUERY_FOR_CLASSES = """
# get all the classes from an ontology

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT distinct ?class
{
    {?class a rdfs:Class .}
    UNION
    {?class a owl:Class .}
}
"""

QUERY_FOR_PROPERTIES = """
# get all the properties from an ontology

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT distinct ?property
{
    {?property a rdf:Property .}
    UNION
    { ?property a owl:ObjectProperty .}
	UNION
    { ?property a owl:DatatypeProperty .}
}
"""

QUERY_FOR_DATA_TYPES = """
# get all the properties from an ontology

PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX sh: <http://www.w3.org/ns/shacl#>

SELECT distinct ?data_type
{
    ?shape a sh:PropertyShape;
        sh:datatype ?data_type .
}
"""


# TODO: to add al the necessary data types:
# generated types: xsd ones; at-voc ones; rdf:PlainLiteral
# custom type: rdf:LangString


def init_rdflib_graph(source: str):
    g = rdflib.Graph()
    g.parse(source, format='ttl')
    return g


async def list_terms_by_query(query: str, source: str, g: rdflib.Graph = None) -> List[str]:
    if not g:
        g = init_rdflib_graph(source)

    result = g.query(query)

    return [element[0] for element in result]


# async def list_known_terms(saved: bool = False) -> List:
#     if saved:
#         return [x.term for x in await Term.find().to_list()]
#
#     classes = await list_terms_by_query(QUERY_FOR_CLASSES, EPO_OWL_SOURCE_CONTENT)
#     properties = await list_terms_by_query(QUERY_FOR_PROPERTIES, EPO_OWL_SOURCE_CONTENT)
#     data_types = await list_terms_by_query(QUERY_FOR_DATA_TYPES, EPO_SHACL_SHAPES_FILE_URL)
#     return list(set(classes + properties + data_types))


async def create_or_update_terms_by_type(terms: List[str],
                                         terms_type: TermType,
                                         project_id: PydanticObjectId,
                                         ns_definitions: dict,
                                         user: User = None):
    project_link = Project.link_from_id(project_id)

    for term in terms:
        found_term = await get_term(term=term, project_id=project_id)
        if not found_term:
            await Term(
                project=project_link,
                term=term,
                short_term=get_prefixed_ns_term(term, ns_definitions),
                type=terms_type
            ).on_create(user=user).save()
        else:
            await found_term.on_update(user).update(
                Set({Term.short_term: get_prefixed_ns_term(term, ns_definitions)}),
                Set({Term.type: terms_type})
            )


def get_terms_from_graph_by_query(query: str, graph: rdflib.Graph) -> List[str]:
    result = graph.query(query)

    return [element[0] for element in result]


async def discover_and_save_terms(
        project_id: PydanticObjectId,
        user: User = None,
        ontology_sources: List[OntologyFileResource] = None
):
    if not ontology_sources:
        ontology_sources_repo = OntologyFileResourceBeanieRepository()
        ontology_sources = await ontology_sources_repo.get_all(project_id=project_id)
    g = rdflib.Graph()
    for ontology_resource in ontology_sources:
        g.parse(data=ontology_resource.content, format='ttl')
    custom_prefixes: Dict = {
        **(await get_default_prefixes_definitions()),
        **(await get_custom_prefixes_definitions())
    }
    for prefix, uri in custom_prefixes.items():
        await discover_and_save_prefix_namespace(project_id, prefix, uri, False)
    for prefix, uri in g.namespaces():
        if prefix in custom_prefixes:
            continue
        await discover_and_save_prefix_namespace(project_id, prefix, uri)
    ns_definitions = await get_project_ns_definitions(project_id)
    classes = get_terms_from_graph_by_query(QUERY_FOR_CLASSES, graph=g)
    properties = get_terms_from_graph_by_query(QUERY_FOR_PROPERTIES, graph=g)
    data_types = get_terms_from_graph_by_query(QUERY_FOR_DATA_TYPES, graph=g)

    await create_or_update_terms_by_type(terms=classes,
                                         terms_type=TermType.CLASS,
                                         project_id=project_id,
                                         ns_definitions=ns_definitions,
                                         user=user)

    await create_or_update_terms_by_type(terms=properties,
                                         terms_type=TermType.PROPERTY,
                                         project_id=project_id,
                                         ns_definitions=ns_definitions,
                                         user=user)

    await create_or_update_terms_by_type(terms=data_types,
                                         terms_type=TermType.DATA_TYPE,
                                         project_id=project_id,
                                         ns_definitions=ns_definitions,
                                         user=user)


async def get_terms_by_type(project_id: PydanticObjectId,
                            terms_type: TermType):
    return await Term.find(
        Term.project == Project.link_from_id(project_id),
        Term.type == terms_type
    ).to_list()


async def is_known_term(term: str) -> bool:
    return True


async def check_content_terms_validity(content: str, project_id: PydanticObjectId) -> List[TermValidityResponse]:
    ns_handler: NamespaceInventory = await get_ns_handler(project_id)

    terms_validity: List[TermValidityResponse] = []
    terms = sorted(list(set(re.findall(r"([\w.\-_]+:[\w.\-_]+)", content))))

    for term in terms:
        if any(x.term == term for x in terms_validity):
            continue

        term_validity = TermValidityResponse(term=term, is_valid=True)
        try:
            ns_term = ns_handler.qname_to_uri(term, error_fail=True)
            term_validity.ns_term = ns_term
            term_validity.is_valid = True if (await get_term(
                term=ns_term,
                project_id=project_id
            )) else False
        except NamespaceInventoryException as e:
            term_validity.is_valid = False
            term_validity.info = e.info or str(e)
        terms_validity.append(term_validity)
    return terms_validity


async def get_term(term: str, project_id: PydanticObjectId) -> Term:
    return await Term.find_one(
        Term.term == term,
        Term.project == Project.link_from_id(project_id)
    )


def last_term_for_search(q: str) -> str:
    first, *middle, last = q.split(' ')
    return last


async def search_terms(q: str) -> List[str]:
    last_term = last_term_for_search(q)
    if not last_term:
        return []

    query_filters: dict = {
        'term': {
            '$regex': last_term,
            '$options': 'i'
        }
    }

    return [x.term for x in await Term.find(query_filters).to_list()]


def get_ns_value_from_term(ns_term: str) -> (str, str):
    parts = [ns_term, None]
    for delimiter in ['#', '/']:
        match = ns_term.rpartition(delimiter)
        if match[1]:
            parts = [match[0] + match[1], match[2]]
            break
    return tuple(parts)


async def get_prefixed_term(ns_term: str, project_id: PydanticObjectId) -> str:
    term_ns, term_value = get_ns_value_from_term(ns_term)
    if not term_value:
        return ns_term

    namespace: Namespace = await get_namespace_by_uri(term_ns, project_id)
    prefix = namespace.prefix if namespace else ''
    return f"{prefix}:{term_value}"


def get_prefixed_ns_term(ns_term: str, ns_definitions: dict) -> str:
    term_ns, term_value = get_ns_value_from_term(ns_term)
    if not term_value:
        return ns_term
    prefix = ns_definitions[term_ns] if term_ns in ns_definitions else ''
    return f"{prefix}:{term_value}"


async def get_prefixed_terms(project_id: PydanticObjectId):
    prefixes = invert_dict(await get_prefixes_definitions(project_id))
    terms = [x.term for x in await Term.find().to_list()]
    prefixed_terms = []
    for term in terms:
        prefixed_terms.append(get_prefixed_ns_term(term, prefixes))
    return list(set(prefixed_terms))
