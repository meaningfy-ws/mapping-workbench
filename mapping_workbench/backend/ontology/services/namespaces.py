import re
from typing import Dict, List

from beanie import PydanticObjectId
from beanie.exceptions import RevisionIdWasChanged

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.ontology.adapters.namespace_handler import NamespaceInventory
from mapping_workbench.backend.ontology.models.namespace import Namespace, NamespaceCustom
from mapping_workbench.backend.project.models.entity import Project


async def discover_and_save_mapping_rule_prefixes(project_id: PydanticObjectId, rule: ConceptualMappingRule):
    from_content = rule.target_class_path + " " + rule.target_property_path
    prefixes = list(set(re.findall(r"([\w.\-_]+):[\w.\-_]+", from_content)))
    if prefixes:
        for prefix in prefixes:
            await discover_and_save_prefix_namespace(
                project_id=project_id,
                prefix=prefix
            )


async def init_prefix_namespace(project_id: PydanticObjectId, prefix: str, uri: str = None) -> Namespace:
    project_link = Project.link_from_id(project_id)
    namespace: Namespace = (await get_namespace_by_prefix(
        prefix=prefix,
        project_id=project_id
    )) or Namespace(
        project=project_link,
        prefix=prefix,
        uri=uri
    )
    return namespace


async def discover_and_save_prefix_namespace(
        project_id: PydanticObjectId, prefix: str, uri: str = None,
        discover: bool = True
):
    namespace: Namespace = await init_prefix_namespace(project_id, prefix, uri)
    if namespace.is_syncable:
        if uri:
            namespace.uri = uri
        elif discover:
            ns_handler: NamespaceInventory = NamespaceInventory()
            try:
                namespace.uri = ns_handler.prefix_to_ns_uri(prefix=prefix)
            except ValueError as e:
                mwb_logger.log_all_error(message="Prefix namespace discovery error", stack_trace=e)
        try:
            await namespace.save()
        except RevisionIdWasChanged:
            mwb_logger.log_all_info(message=f"Namespace: {namespace.prefix} already exists")
            pass
        except Exception as e:
            mwb_logger.log_all_error(message=f"Namespace saving error", stack_trace=str(
                e) or f"No stack trace provided. Exception Name: {e.__class__.__name__}")


async def get_prefixes_definitions(project_id: PydanticObjectId) -> Dict[str, str]:
    return {x.prefix: (x.uri or '') for x in (await Namespace.find(
        Namespace.project == Project.link_from_id(project_id)
    ).to_list())}


async def get_custom_prefixes_definitions() -> Dict[str, str]:
    return {x.prefix: (x.uri or '') for x in (await NamespaceCustom.find_all().to_list())}


async def get_ns_handler(project_id: PydanticObjectId) -> NamespaceInventory:
    return NamespaceInventory(namespace_definition_dict=await get_prefixes_definitions(project_id))


async def get_namespace_by_prefix(prefix: str, project_id: PydanticObjectId) -> Namespace:
    return await Namespace.find_one(
        Namespace.project == Project.link_from_id(project_id),
        Namespace.prefix == prefix
    )


async def get_project_ns_definitions(project_id: PydanticObjectId) -> dict:
    namespaces = await Namespace.find(
        Namespace.project == Project.link_from_id(project_id)
    ).to_list()

    ns_definitions = {
        (x.uri or ''): x.prefix
        for x in sorted(
            list(filter(lambda x: x.prefix, namespaces)),
            key=lambda namespace: (namespace.uri or '', namespace.prefix),
            reverse=True
        )
    }
    return ns_definitions
