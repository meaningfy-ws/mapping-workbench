from pathlib import Path

import pytest
from fastapi import UploadFile

from mapping_workbench.backend.core.services.exceptions import ResourceConflictException
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.test_data_suite.services.import_test_data_suite import \
    import_test_data_suites_from_archive


def create_upload_file(file_path: Path) -> UploadFile:
    file_path.open('rb')
    return UploadFile(
        filename=file_path.name,
        file=file_path.open('rb')
    )


@pytest.mark.asyncio
async def test_import_test_data_suite(archive_path: Path, dummy_project: Project):
    await import_test_data_suites_from_archive(
        dummy_project.id,
        create_upload_file(archive_path)
    )

    project_link = Project.link_from_id(dummy_project.id)

    assert (await TestDataSuite.find(
        TestDataSuite.project == project_link
    ).count()) == 2

    assert (await TestDataFileResource.find(
        TestDataSuite.project == project_link
    ).count()) == 37

    with pytest.raises(ResourceConflictException):
        await import_test_data_suites_from_archive(
            dummy_project.id,
            create_upload_file(archive_path)
        )
