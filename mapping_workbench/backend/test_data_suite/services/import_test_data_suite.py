import io
import tempfile
import zipfile
from pathlib import Path

from beanie import PydanticObjectId
from fastapi import UploadFile

from mapping_workbench.backend.core.services.exceptions import ResourceConflictException
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.test_data_suite.services.data import is_valid_test_data_format
from mapping_workbench.backend.user.models.user import User


async def import_test_data_suites_from_archive(
        project_id: PydanticObjectId,
        file: UploadFile,
        user: User = None
):
    project_link = Project.link_from_id(project_id)

    zf = zipfile.ZipFile(io.BytesIO(file.file.read()))
    temp_dir = tempfile.TemporaryDirectory()
    temp_dir_path = Path(temp_dir.name)
    zf.extractall(temp_dir_path)

    for path in temp_dir_path.iterdir():
        if path.is_dir():
            test_data_suite_title = path.name
            if await TestDataSuite.find_one(
                    TestDataSuite.project == project_link,
                    TestDataSuite.title == test_data_suite_title
            ):
                raise ResourceConflictException(
                    detail=f"`{test_data_suite_title}` Test Data Suite already exists!"
                )
            test_data_suite = TestDataSuite(
                title=test_data_suite_title,
                project=project_link
            )
            test_data_suite.on_create(user=user)
            await test_data_suite.create()
            suite_id = test_data_suite.id
            for file in path.iterdir():
                if file.is_file():
                    test_format = file.suffix[1:].upper()
                    if not is_valid_test_data_format(test_format):
                        continue
                    test_data = TestDataFileResource(
                        identifier=file.stem,
                        title=file.name,
                        filename=file.name,
                        format=test_format,
                        path=[test_data_suite.title],
                        test_data_suite=TestDataSuite.link_from_id(suite_id),
                        project=project_link,
                        content=file.read_text(encoding="utf-8")
                    )
                    test_data.on_create(user=user)
                    await test_data.create()
