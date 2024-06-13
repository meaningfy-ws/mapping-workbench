import json

import pytest
from beanie import PydanticObjectId
from fastapi import status

from mapping_workbench.backend.ontology_suite.entrypoints.api.routes import ONTOLOGY_FILE_ROUTE_PREFIX
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import ONTOLOGY_FILE_FORMATS


@pytest.mark.asyncio
async def test_ontology_files_api(ontology_schema_test_client, dummy_project):
    dummy_id = "66632b18d962477185de6d85"
    dummy_file_name = f"dummy1.{ONTOLOGY_FILE_FORMATS[0]}"

    ontology_files_path = ONTOLOGY_FILE_ROUTE_PREFIX

    response = ontology_schema_test_client.get(ontology_files_path)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    response = ontology_schema_test_client.get(
        ontology_files_path,
        params={"project_id": dummy_id}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    dummy_project.id = PydanticObjectId(dummy_id)
    await dummy_project.create()
    response = ontology_schema_test_client.get(
        ontology_files_path,
        params={"project_id": dummy_id}
    )
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 0

    ontology_file_path = ontology_files_path + "/{ontology_file_name}"

    response = ontology_schema_test_client.get(ontology_file_path)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    response = ontology_schema_test_client.get(
        ontology_file_path,
        params={"project_id": dummy_id}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    response = ontology_schema_test_client.post(
        ontology_files_path,
        params={"project_id": dummy_id},
        data=json.dumps({"filename": dummy_file_name,
                         "content": "abcdefghijcklmn"}))

    assert response.status_code == status.HTTP_201_CREATED

    response = ontology_schema_test_client.delete(
        ontology_files_path + f"/{dummy_file_name}",
        params={"project_id": dummy_id})

    assert response.status_code == status.HTTP_200_OK
