from datetime import datetime

from beanie import Link, PydanticObjectId
from dateutil.tz import tzlocal
from pydantic import BaseModel

from mapping_workbench.backend.core.models.base_entity import BaseEntity
from mapping_workbench.backend.user.models.user import User


def request_data_update_refs(data: dict, entity_data: BaseModel) -> dict:
    for field in entity_data.model_fields:
        prop = entity_data.__dict__[field]
        if isinstance(prop, (Link, PydanticObjectId)):
            data[field] = prop
    return data


def request_update_data(entity_data: BaseModel, user: User = None) -> dict:
    data = entity_data.model_dump(exclude_unset=True)
    data = request_data_update_refs(data, entity_data)

    if user:
        data['updated_by'] = User.link_from_id(user.id)
    data['updated_at'] = datetime.now(tzlocal())

    return data


def request_create_data(entity_data: BaseModel, user: User = None) -> dict:
    data = entity_data.model_dump()
    data = request_data_update_refs(data, entity_data)

    if user:
        data['created_by'] = User.link_from_id(user.id)
    data['created_at'] = datetime.now(tzlocal())

    return data


def api_entity_is_found(entity: BaseEntity) -> bool:
    return entity and not entity.is_deleted


def prepare_search_param(query_filters: dict):
    if 'q' in query_filters:
        query_filters['$text'] = {
            '$search': f"\"{query_filters['q']}\"",
            # '$language': 'english',
            '$caseSensitive': False,
            '$diacriticSensitive': False
        }
        del query_filters['q']


def pagination_params(page: int, limit: int) -> (int, int):
    skip: int = (page or 0) * (limit or 0) or None
    limit: int = limit or None
    return skip, limit
