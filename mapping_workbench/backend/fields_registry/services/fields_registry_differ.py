# from typing import List
#
# from mapping_workbench.backend.fields_registry.models.field_registry import FieldsRegistry, StructuralField, \
#     StructuralNode
# from mapping_workbench.backend.fields_registry.models.field_registry_diff import FieldsRegistryDiff, \
#     UpdatedStructuralFieldDiff, StringValeDiff, BoolValeDiff, UpdatedStructuralNodeDiff
#
#
# def get_updated_fields_diff(old_potentially_updated_fields: List[StructuralField],
#                             new_potentially_updated_fields: List[StructuralField]) -> List[UpdatedStructuralFieldDiff]:
#     updated_fields = []
#     for old_field in old_potentially_updated_fields:
#         is_field_updated = False
#         updated_structural_field_diff = UpdatedStructuralFieldDiff()
#         for new_field in new_potentially_updated_fields:
#             if old_field.id == new_field.id:
#                 if old_field.absolute_xpath != new_field.absolute_xpath:
#                     updated_structural_field_diff.absolute_xpath = StringValeDiff(old_value=old_field.absolute_xpath,
#                                                                                   new_value=new_field.absolute_xpath)
#                     is_field_updated = True
#                 if old_field.relative_xpath != new_field.relative_xpath:
#                     updated_structural_field_diff.relative_xpath = StringValeDiff(old_value=old_field.relative_xpath,
#                                                                                   new_value=new_field.relative_xpath)
#                     is_field_updated = True
#                 if old_field.repeatable != new_field.repeatable:
#                     updated_structural_field_diff.repeatable = BoolValeDiff(old_value=old_field.repeatable,
#                                                                             new_value=new_field.repeatable)
#                     is_field_updated = True
#                 if old_field.parent_node_id != new_field.parent_node_id:
#                     updated_structural_field_diff.parent_node_id = StringValeDiff(old_value=old_field.parent_node_id,
#                                                                                   new_value=new_field.parent_node_id)
#                     is_field_updated = True
#                 if old_field.description != new_field.description:
#                     updated_structural_field_diff.description = StringValeDiff(old_value=old_field.description,
#                                                                                new_value=new_field.description)
#                     is_field_updated = True
#                 if old_field.imported != new_field.imported:
#                     updated_structural_field_diff.imported = BoolValeDiff(old_value=old_field.imported,
#                                                                           new_value=new_field.imported)
#                     is_field_updated = True
#                 if old_field.name != new_field.name:
#                     updated_structural_field_diff.name = StringValeDiff(old_value=old_field.name,
#                                                                         new_value=new_field.name)
#                     is_field_updated = True
#                 if old_field.bt_id != new_field.bt_id:
#                     updated_structural_field_diff.bt_id = StringValeDiff(old_value=old_field.bt_id,
#                                                                          new_value=new_field.bt_id)
#                     is_field_updated = True
#                 if old_field.value_type != new_field.value_type:
#                     updated_structural_field_diff.value_type = StringValeDiff(old_value=old_field.value_type,
#                                                                               new_value=new_field.value_type)
#                     is_field_updated = True
#                 if old_field.legal_type != new_field.legal_type:
#                     updated_structural_field_diff.legal_type = StringValeDiff(old_value=old_field.legal_type,
#                                                                               new_value=new_field.legal_type)
#                     is_field_updated = True
#                 if is_field_updated:
#                     updated_fields.append(updated_structural_field_diff)
#     return updated_fields
#
#
# def get_updated_nodes_diff(old_potentially_updated_nodes: List[StructuralNode],
#                            new_potentially_updated_nodes: List[StructuralNode]) -> List[UpdatedStructuralNodeDiff]:
#     updated_nodes = []
#     for old_node in old_potentially_updated_nodes:
#         is_node_updated = False
#         updated_structural_node_diff = UpdatedStructuralNodeDiff()
#         for new_node in new_potentially_updated_nodes:
#             if old_node.id == new_node.id:
#                 if old_node.absolute_xpath != new_node.absolute_xpath:
#                     updated_structural_node_diff.absolute_xpath = StringValeDiff(old_value=old_node.absolute_xpath,
#                                                                                  new_value=new_node.absolute_xpath)
#                     is_node_updated = True
#                 if old_node.relative_xpath != new_node.relative_xpath:
#                     updated_structural_node_diff.relative_xpath = StringValeDiff(old_value=old_node.relative_xpath,
#                                                                                  new_value=new_node.relative_xpath)
#                     is_node_updated = True
#                 if old_node.repeatable != new_node.repeatable:
#                     updated_structural_node_diff.repeatable = BoolValeDiff(old_value=old_node.repeatable,
#                                                                            new_value=new_node.repeatable)
#                     is_node_updated = True
#                 if old_node.parent_node_id != new_node.parent_node_id:
#                     updated_structural_node_diff.parent_node_id = StringValeDiff(old_value=old_node.parent_node_id,
#                                                                                  new_value=new_node.parent_node_id)
#                     is_node_updated = True
#                 if old_node.description != new_node.description:
#                     updated_structural_node_diff.description = StringValeDiff(old_value=old_node.description,
#                                                                               new_value=new_node.description)
#                     is_node_updated = True
#                 if old_node.imported != new_node.imported:
#                     updated_structural_node_diff.imported = BoolValeDiff(old_value=old_node.imported,
#                                                                          new_value=new_node.imported)
#                     is_node_updated = True
#                 if is_node_updated:
#                     updated_nodes.append(updated_structural_node_diff)
#     return updated_nodes
#
#
# def get_fields_registry_diff(old_field_registry: FieldsRegistry,
#                              new_field_registry: FieldsRegistry) -> FieldsRegistryDiff:
#     old_fields_id = {field.id for field in old_field_registry.fields}
#     new_fields_id = {field.id for field in new_field_registry.fields}
#     deleted_fields = [field for field in old_field_registry.fields if field.id not in new_fields_id]
#     new_fields = [field for field in new_field_registry.fields if field.id not in old_fields_id]
#     updated_fields_id = old_fields_id & new_fields_id
#     old_potentially_updated_fields = [field for field in old_field_registry.fields if field.id in updated_fields_id]
#     new_potentially_updated_fields = [field for field in new_field_registry.fields if field.id in updated_fields_id]
#     updated_fields = get_updated_fields_diff(old_potentially_updated_fields=old_potentially_updated_fields,
#                                              new_potentially_updated_fields=new_potentially_updated_fields)
#     old_nodes_id = {node.id for node in old_field_registry.nodes}
#     new_nodes_id = {node.id for node in new_field_registry.nodes}
#     deleted_nodes = [node for node in old_field_registry.nodes if node.id not in new_nodes_id]
#     new_nodes = [node for node in new_field_registry.nodes if node.id not in old_nodes_id]
#     updated_nodes_id = old_nodes_id & new_nodes_id
#     old_potentially_updated_nodes = [node for node in old_field_registry.nodes if node.id in updated_nodes_id]
#     new_potentially_updated_nodes = [node for node in new_field_registry.nodes if node.id in updated_nodes_id]
#     updated_nodes = get_updated_nodes_diff(old_potentially_updated_nodes=old_potentially_updated_nodes,
#                                            new_potentially_updated_nodes=new_potentially_updated_nodes)
#     updated_title = None
#     updated_root_node_id = None
#
#     if old_field_registry.title != new_field_registry.title:
#         updated_title = new_field_registry.title
#
#     if old_field_registry.root_node_id != new_field_registry.root_node_id:
#         updated_root_node_id = new_field_registry.root_node_id
#
#     return FieldsRegistryDiff(deleted_fields=deleted_fields,
#                               new_fields=new_fields,
#                               updated_fields=updated_fields,
#                               deleted_nodes=deleted_nodes,
#                               new_nodes=new_nodes,
#                               updated_nodes=updated_nodes,
#                               updated_title=updated_title,
#                               updated_root_node_id=updated_root_node_id)
