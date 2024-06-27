from enum import Enum

from fastapi.testclient import TestClient

from mapping_workbench.backend.core.entrypoints.api.main import ROOT_API_PATH
from mapping_workbench.backend.core.entrypoints.api.main import app

client = TestClient(app)


class ApiActions(Enum):
    LIST = 'list'
    CREATE = 'create'
    READ = 'read'
    UPDATE = 'update'
    DELETE = 'delete'


def api_endpoint(path):
    return ROOT_API_PATH + path


async def entity_crud_routes_tests(
        req_headers, route_prefix, entity_data, entity_model,
        entity_retrieve_filters=None,
        entity_update_fields=None,
        route_prefixes=None,
        is_form_request=False
):
    if route_prefixes is None:
        route_prefixes = {
            ApiActions.LIST: route_prefix,
            ApiActions.CREATE: route_prefix,
            ApiActions.READ: route_prefix,
            ApiActions.UPDATE: route_prefix,
            ApiActions.DELETE: route_prefix
        }
    # LIST
    response = client.get(api_endpoint(route_prefixes[ApiActions.LIST]), headers=req_headers)
    assert response.status_code == 200
    assert "items" in response.json()

    if entity_retrieve_filters is None:
        entity_retrieve_filters = {entity_model.title: entity_data["title"]}

    if entity_update_fields is None:
        entity_update_fields = {
            "title": f"new-{entity_data['title']}"
        }

    # CREATE
    response = client.post(
        api_endpoint(route_prefixes[ApiActions.CREATE]),
        json=entity_data if not is_form_request else None,
        data=entity_data if is_form_request else None,
        headers=req_headers
    )
    assert response.status_code == 201

    entity = await entity_model.find_one(entity_retrieve_filters)
    assert entity

    entity_id = str(entity.id)

    # READ
    response = client.get(
        api_endpoint(f"{route_prefixes[ApiActions.READ]}/{entity_id}"),
        headers=req_headers
    )
    assert response.status_code == 200
    res = response.json()
    assert res
    assert res["_id"] == entity_id

    # UPDATE
    update_data = {**entity_data, **entity_update_fields}
    response = client.patch(
        api_endpoint(f"{route_prefixes[ApiActions.UPDATE]}/{entity_id}"),
        json=update_data if not is_form_request else None,
        data=update_data if is_form_request else None,
        headers=req_headers
    )
    assert response.status_code == 200
    updated_entity = await entity_model.get(entity_id)
    assert updated_entity
    updated_field, updated_value = list(entity_update_fields.items())[0]
    assert getattr(updated_entity, updated_field) == updated_value

    # DELETE
    response = client.delete(
        api_endpoint(f"{route_prefixes[ApiActions.DELETE]}/{entity_id}"),
        headers=req_headers
    )
    assert response.status_code == 200
    assert response.json()["id"] == entity_id

    assert not (await entity_model.get(entity_id))
