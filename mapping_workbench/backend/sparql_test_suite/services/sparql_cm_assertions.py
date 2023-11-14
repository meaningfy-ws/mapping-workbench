import re
from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.conceptual_mapping_rule.services.data import get_conceptual_mapping_rules_for_project
from mapping_workbench.backend.file_resource.models.file_resource import FileResourceFormat
from mapping_workbench.backend.ontology.services.namespaces import get_prefixes_definitions
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestFileResource, SPARQLTestSuite, \
    SPARQLQueryValidationType
from mapping_workbench.backend.sparql_test_suite.services.api import get_sparql_test_suite_by_project_and_title
from mapping_workbench.backend.user.models.user import User

DEFAULT_RQ_NAME = 'sparql_query_'

SPARQL_PREFIX_PATTERN = re.compile('(?:\\s+|^)([\\w\\-]+)?:')
SPARQL_PREFIX_LINE = 'PREFIX {prefix}: <{value}>'

SPARQL_XPATH_SEPARATOR = " ;; "

SPARQL_CM_ASSERTIONS_SUITE_TITLE = "cm_assertions"


def get_sparql_prefixes(sparql_q: str) -> list:
    finds: list = re.findall(SPARQL_PREFIX_PATTERN, sparql_q)
    return sorted(set(finds))


def concat_cm_rule_field_xpaths(cm_rule: ConceptualMappingRule, separator: str = SPARQL_XPATH_SEPARATOR) -> str:
    return separator.join(cm_rule.source_xpath or [])


async def generate_and_save_cm_assertions_queries(
        project_id: PydanticObjectId,
        user: User = None,
        rq_name: str = DEFAULT_RQ_NAME,
        prefixes_definitions=None
):
    """
    """

    project_link = Project.link_from_id(project_id)

    sparql_test_suite = await get_sparql_test_suite_by_project_and_title(
        project_id=project_id,
        sparql_test_suite_title=SPARQL_CM_ASSERTIONS_SUITE_TITLE
    )
    if not sparql_test_suite:
        sparql_test_suite = await SPARQLTestSuite(
            title=SPARQL_CM_ASSERTIONS_SUITE_TITLE,
            type=SPARQLQueryValidationType.CM_ASSERTION,
            path=[SPARQL_CM_ASSERTIONS_SUITE_TITLE],
            project=project_link
        )
        if user is not None:
            sparql_test_suite.on_create(user=user)

        sparql_test_suite.save()

    sparql_test_suite_link = SPARQLTestSuite.link_from_id(sparql_test_suite.id)

    if prefixes_definitions is None:
        prefixes_definitions = await get_prefixes_definitions()

    cm_rules: List[ConceptualMappingRule] = await get_conceptual_mapping_rules_for_project(project_id=project_id)
    for index, cm_rule in enumerate(cm_rules):
        prefixes_string = cm_rule.target_property_path

        sparql_title = " - ".join(filter(lambda x: x, [cm_rule.field_id, cm_rule.field_title]))

        prefixes = []
        for prefix in get_sparql_prefixes(prefixes_string):
            if prefix in prefixes_definitions:
                prefix_value = prefixes_definitions.get(prefix)
            else:
                # the prefix value is set to "^" on purpose, to generate a syntactically incorrect SPARQL query
                prefix_value = "^"

            prefixes.append(SPARQL_PREFIX_LINE.format(prefix=prefix, value=prefix_value))

        subject_type_display = ''
        file_name = f"{rq_name}{index}.rq"
        file_content = f"#title: {sparql_title}\n" \
                       f"#description: “{cm_rule.field_description}” " \
                       f"The corresponding XML element is " \
                       f"{concat_cm_rule_field_xpaths(cm_rule)}. " \
                       f"The expected ontology instances are epo: {cm_rule.target_class_path} .\n" \
                       f"#xpath: {concat_cm_rule_field_xpaths(cm_rule, separator=SPARQL_XPATH_SEPARATOR)}" \
                       "\n" + "\n" + "\n".join(prefixes) + \
                       "\n\n" + \
                       f"ASK WHERE {{ " \
                       f"{subject_type_display}" \
                       f"\n\t{cm_rule.target_property_path} \n}}"

        sparql_test_file_resource = await SPARQLTestFileResource.find_one(
            SPARQLTestFileResource.project == project_link,
            SPARQLTestFileResource.sparql_test_suite == sparql_test_suite_link,
            SPARQLTestFileResource.title == sparql_title
        )

        if not sparql_test_file_resource:
            sparql_test_file_resource = SPARQLTestFileResource(
                project=project_link,
                sparql_test_suite=sparql_test_suite_link,
                format=FileResourceFormat.RQ.value,
                title=sparql_title,
                filename=file_name,
                path=[sparql_test_suite.title, file_name],
                content=file_content,
                type=sparql_test_suite.type
            )
            if user is not None:
                sparql_test_file_resource.on_create(user)
            await sparql_test_file_resource.save()
        else:
            sparql_test_file_resource.title = sparql_title
            sparql_test_file_resource.content = file_content
            if user is not None:
                sparql_test_file_resource.on_update(user)
            await sparql_test_file_resource.save()


async def clean_sparql_cm_assertions_queries_for_project(project_id: PydanticObjectId):
    sparql_test_suite = await get_sparql_test_suite_by_project_and_title(
        project_id=project_id,
        sparql_test_suite_title=SPARQL_CM_ASSERTIONS_SUITE_TITLE
    )

    if sparql_test_suite:
        await SPARQLTestFileResource.find(
            SPARQLTestFileResource.project == Project.link_from_id(project_id),
            SPARQLTestFileResource.sparql_test_suite == SPARQLTestSuite.link_from_id(sparql_test_suite.id)
        ).delete()