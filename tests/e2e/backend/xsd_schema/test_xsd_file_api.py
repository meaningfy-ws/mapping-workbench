import json

import pytest
from beanie import PydanticObjectId
from fastapi import status

from mapping_workbench.backend.xsd_schema.entrypoints.api.routes import XSD_SCHEMA_ROUTE_PREFIX, \
    XSD_SCHEMA_FILE_ROUTE_PREFIX


@pytest.mark.asyncio
async def test_get_all_xsd_files(xsd_schema_test_client, dummy_project):
    dummy_id = "66632b18d962477185de6d85"
    dummy_file_name = "dummy1.xsd"

    xsd_files_path = XSD_SCHEMA_ROUTE_PREFIX + XSD_SCHEMA_FILE_ROUTE_PREFIX

    response = xsd_schema_test_client.get(xsd_files_path)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    response = xsd_schema_test_client.get(
        xsd_files_path,
        params={"project_id": dummy_id}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    dummy_project.id = PydanticObjectId(dummy_id)
    await dummy_project.create()
    response = xsd_schema_test_client.get(
        xsd_files_path,
        params={"project_id": dummy_id}
    )
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 0

    xsd_file_path = xsd_files_path + "/{xsd_file_name}"

    response = xsd_schema_test_client.get(xsd_file_path)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    response = xsd_schema_test_client.get(
        xsd_file_path,
        params={"project_id": dummy_id}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    response = xsd_schema_test_client.post(
        xsd_files_path,
        params={"project_id": dummy_id},
        data=json.dumps({"filename": dummy_file_name,
                         "content": "abcdefghijcklmn"}))

    assert response.status_code == status.HTTP_201_CREATED

    response = xsd_schema_test_client.delete(
        xsd_files_path + f"/{dummy_file_name}",
        params={"project_id": dummy_id})

    assert response.status_code == status.HTTP_200_OK
