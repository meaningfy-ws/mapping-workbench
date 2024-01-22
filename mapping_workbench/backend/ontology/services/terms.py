import re
from typing import List

import rdflib
from rdflib import RDF

from mapping_workbench.backend.ontology.adapters import invert_dict
from mapping_workbench.backend.ontology.adapters.namespace_handler import NamespaceInventory, \
    NamespaceInventoryException
from mapping_workbench.backend.ontology.models.term import Term, TermValidityResponse
from mapping_workbench.backend.ontology.services.namespaces import discover_and_save_prefix_namespace, get_ns_handler, \
    get_prefixes_definitions
from mapping_workbench.backend.user.models.user import User

EPO_OWL_SOURCE_CONTENT = \
    'https://raw.githubusercontent.com/OP-TED/ePO/master/implementation/ePO_core/owl_ontology/ePO_core.ttl'

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


def init_rdflib_graph():
    g = rdflib.Graph()
    g.parse(EPO_OWL_SOURCE_CONTENT, format='ttl')
    return g


async def list_terms_by_query(query: str, g: rdflib.Graph = None):
    if not g:
        g = init_rdflib_graph()

    g.query(query)

    return list(set([s for s, p, o in g.triples((None, RDF.type, None))]))


async def list_known_terms(saved: bool = False) -> List:
    if saved:
        return [x.term for x in await Term.find().to_list()]

    classes = await list_terms_by_query(QUERY_FOR_CLASSES)
    properties = await list_terms_by_query(QUERY_FOR_PROPERTIES)
    return list(set(classes + properties))


async def discover_and_save_terms(user: User = None):
    g = init_rdflib_graph()

    for prefix, uri in g.namespaces():
        await discover_and_save_prefix_namespace(prefix, uri)

    classes = await list_terms_by_query(QUERY_FOR_CLASSES, g=g)
    properties = await list_terms_by_query(QUERY_FOR_PROPERTIES, g=g)
    for term in list(set(classes + properties)):
        if not await Term.find_one(
                Term.term == term
        ):
            await Term(term=term).on_create(user=user).save()


async def is_known_term(term: str) -> bool:
    return True


async def check_content_terms_validity(content: str) -> List[TermValidityResponse]:
    ns_handler: NamespaceInventory = await get_ns_handler()

    terms_validity: List[TermValidityResponse] = []
    terms = sorted(list(set(re.findall(r"([\w.\-_]+:[\w.\-_]+)", content))))

    for term in terms:
        if any(x.term == term for x in terms_validity):
            continue

        term_validity = TermValidityResponse(term=term, is_valid=True)
        try:
            ns_term = ns_handler.qname_to_uri(term, error_fail=True)
            term_validity.ns_term = ns_term
            term_validity.is_valid = True if await Term.find_one(Term.term == ns_term) else False
        except NamespaceInventoryException as e:
            term_validity.is_valid = False
            term_validity.info = e.info or str(e)
        terms_validity.append(term_validity)
    return terms_validity


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


async def get_prefixed_terms():
    prefixes = invert_dict(await get_prefixes_definitions())
    terms = [x.term for x in await Term.find().to_list()]
    prefixed_terms = []
    for term in terms:
        parts = term.split('#')
        ns = parts[0] + '#'
        term_value = parts[1] if len(parts) == 2 else ''
        prefix = prefixes[ns] if ns in prefixes else ''
        prefixed_terms.append(f"{prefix}:{term_value}")
    return list(set(prefixed_terms))
