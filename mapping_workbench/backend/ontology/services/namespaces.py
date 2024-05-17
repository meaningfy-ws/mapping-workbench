import re
from typing import Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.ontology.adapters.namespace_handler import NamespaceInventory
from mapping_workbench.backend.ontology.models.namespace import Namespace
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


async def discover_and_save_prefix_namespace(project_id: PydanticObjectId, prefix: str, uri: str = None):
    project_link = Project.link_from_id(project_id)
    namespace: Namespace = (await get_namespace_by_prefix(
        prefix=prefix,
        project_id=project_id
    )) or Namespace(
        project=project_link,
        prefix=prefix,
        uri=uri
    )

    if namespace.is_syncable:
        if uri:
            namespace.uri = uri
        else:
            ns_handler: NamespaceInventory = NamespaceInventory()
            try:
                namespace.uri = ns_handler.prefix_to_ns_uri(prefix=prefix)
            except ValueError as e:
                pass
        await namespace.save()


async def get_prefixes_definitions(project_id: PydanticObjectId) -> Dict[str, str]:
    return {x.prefix: (x.uri or '') for x in (await Namespace.find(
        Namespace.project == Project.link_from_id(project_id)
    ).to_list())}


async def get_ns_handler(project_id: PydanticObjectId) -> NamespaceInventory:
    return NamespaceInventory(namespace_definition_dict=await get_prefixes_definitions(project_id))


async def get_namespace_by_prefix(prefix: str, project_id: PydanticObjectId) -> Namespace:
    return await Namespace.find_one(
        Namespace.project == Project.link_from_id(project_id),
        Namespace.prefix == prefix
    )
