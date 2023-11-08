import re
from typing import Dict

from mapping_workbench.backend.conceptual_mapping_rule.models.entity import ConceptualMappingRule
from mapping_workbench.backend.ontology.adapters.namespace_handler import NamespaceInventory
from mapping_workbench.backend.ontology.models.namespace import Namespace


async def discover_and_save_mapping_rule_prefixes(rule: ConceptualMappingRule):
    from_content = rule.target_class_path + " " + rule.target_property_path
    prefixes = list(set(re.findall(r"([\w.\-_]+):[\w.\-_]+", from_content)))
    if prefixes:
        for prefix in prefixes:
            await discover_and_save_prefix_namespace(prefix)


async def discover_and_save_prefix_namespace(prefix: str, uri: str = None):
    namespace: Namespace = (await Namespace.find_one(Namespace.prefix == prefix)) or Namespace(prefix=prefix)
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


async def get_prefixes_definitions() -> Dict[str, str]:
    return {x.prefix: (x.uri or '') for x in (await Namespace.find_all().to_list())}


async def get_ns_handler() -> NamespaceInventory:
    return NamespaceInventory(namespace_definition_dict=await get_prefixes_definitions())
