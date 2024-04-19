from typing import Optional

from beanie import Link, Indexed

from mapping_workbench.backend.core.models.base_project_resource_entity import BaseProjectResourceEntity, \
    BaseProjectResourceEntityInSchema, BaseProjectResourceEntityOutSchema
from mapping_workbench.backend.state_manager.models.state_object import ObjectState
from mapping_workbench.backend.triple_map_fragment.models.entity import GenericTripleMapFragment, TripleMapFragmentState


class MappingRuleRegistryIn(BaseProjectResourceEntityInSchema):
    pass


class MappingRuleRegistryCreateIn(MappingRuleRegistryIn):
    title: str


class MappingRuleRegistryUpdateIn(MappingRuleRegistryIn):
    title: Optional[str] = None


class MappingRuleRegistryOut(BaseProjectResourceEntityOutSchema):
    title: Optional[str] = None
    # mapping_rules: Optional[List[Link[ConceptualMappingRule]]] = None


class MappingRuleRegistry(BaseProjectResourceEntity):
    title: Indexed(str, unique=True)

    # mapping_rules: Optional[List[Link[ConceptualMappingRule]]] = None

    class Settings(BaseProjectResourceEntity.Settings):
        name = "mapping_rule_registries"


class MappingGroupException(Exception):
    pass


class MappingGroupIn(BaseProjectResourceEntityInSchema):
    class_uri: Optional[str] = None
    iterator_xpath: Optional[str] = None
    instance_uri_template: Optional[str] = None
    triple_map: Optional[Link[GenericTripleMapFragment]] = None


class MappingGroupCreateIn(MappingGroupIn):
    name: str


class MappingGroupUpdateIn(MappingGroupIn):
    name: Optional[str] = None


class MappingGroupOut(BaseProjectResourceEntityOutSchema):
    name: Optional[str] = None
    class_uri: Optional[str] = None
    iterator_xpath: Optional[str] = None
    instance_uri_template: Optional[str] = None
    triple_map: Optional[Link[GenericTripleMapFragment]] = None


class MappingGroupState(ObjectState):
    name: Optional[str] = None
    class_uri: Optional[str] = None
    iterator_xpath: Optional[str] = None
    instance_uri_template: Optional[str] = None
    triple_map: Optional[TripleMapFragmentState] = None


class MappingGroup(BaseProjectResourceEntity):
    name: Indexed(str, unique=True)
    class_uri: Optional[str] = None
    iterator_xpath: Optional[str] = None
    instance_uri_template: Optional[str] = None
    triple_map: Optional[Link[GenericTripleMapFragment]] = None

    async def get_state(self) -> MappingGroupState:
        triple_map_state = None
        if self.triple_map:
            triple_map = await self.triple_map.fetch()
            triple_map_state = await triple_map.get_state()

        return MappingGroupState(
            name=self.name,
            class_uri=self.class_uri,
            iterator_xpath=self.iterator_xpath,
            instance_uri_template=self.instance_uri_template,
            triple_map=triple_map_state
        )

    def set_state(self, state: MappingGroupState):
        raise MappingGroupException("Setting the state of a mapping group is not supported.")

    class Settings(BaseProjectResourceEntity.Settings):
        name = "mapping_groups"
