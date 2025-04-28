import io
import tempfile
import zipfile
from pathlib import Path

from beanie import PydanticObjectId
from fastapi import UploadFile

from mapping_workbench.backend.core.services.exceptions import ResourceConflictException
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource, \
    SPARQLTestFileResourceFormat
from mapping_workbench.backend.sparql_test_suite.services.data import is_valid_sparql_format
from mapping_workbench.backend.user.models.user import User


async def import_sparql_test_suites_from_archive(
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
            sparql_test_suite_title = path.name
            if await SPARQLTestSuite.find_one(
                    SPARQLTestSuite.project == project_link,
                    SPARQLTestSuite.title == sparql_test_suite_title
            ):
                raise ResourceConflictException(
                    detail=f"`{sparql_test_suite_title}` SPARQL Test Suite already exists!"
                )
            sparql_test_suite = SPARQLTestSuite(
                title=sparql_test_suite_title,
                project=project_link
            )
            sparql_test_suite.on_create(user=user)
            await sparql_test_suite.create()
            suite_id = sparql_test_suite.id
            for file in path.iterdir():
                if file.is_file():
                    test_format = SPARQLTestFileResourceFormat.RQ.value

                    if not is_valid_sparql_format(test_format):
                        continue
                    test_data = SPARQLTestFileResource(
                        title=file.name,
                        filename=file.name,
                        format=test_format,
                        path=[sparql_test_suite.title],
                        sparql_test_suite=SPARQLTestSuite.link_from_id(suite_id),
                        project=project_link,
                        content=file.read_text(encoding="utf-8")
                    )
                    test_data.on_create(user=user)
                    await test_data.create()
