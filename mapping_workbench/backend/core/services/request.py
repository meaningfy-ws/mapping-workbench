from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity


def request_update_data(entity_data: BaseModel) -> dict:
    update_data = entity_data.model_dump(exclude_unset=True)
    update_data.pop('id', None)
    return update_data


def request_create_data(entity_data: BaseModel) -> dict:
    return entity_data.model_dump()


def api_entity_is_found(entity: BaseEntity) -> bool:
    return entity and not entity.is_deleted
