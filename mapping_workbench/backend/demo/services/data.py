import pathlib
from datetime import datetime

from beanie import PydanticObjectId
from dateutil.tz import tzlocal

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.demo.resources import PROJECT1_PATH, PROJECT2_PATH, ONTOLOGY_FILE_PATH, \
    ONTOLOGY_FILE_NAME
from mapping_workbench.backend.demo.services.notification import send_demo_reset_notifications
from mapping_workbench.backend.ontology.services.terms import discover_and_save_terms
from mapping_workbench.backend.ontology_suite.entrypoints.api.routes import ontology_file_repository
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResource
from mapping_workbench.backend.package_importer.adapters.eforms.importer import EFormsPackageImporter
from mapping_workbench.backend.package_importer.adapters.importer_abc import PackageImporterABC
from mapping_workbench.backend.package_importer.services.import_mono_eforms_mapping_suite import \
    import_eforms_mapping_suite_from_file_system
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.tasks.models.task_response import TaskResponse
from mapping_workbench.backend.user.models.user import User

GITHUB_EFORMS_SDK_FIELDS_REPO_URL = "https://github.com/OP-TED/eForms-SDK"

PROJECT1_TITLE = "DEMO Project 1"
PROJECT2_TITLE = "DEMO Project 2"


async def reset_demo_data(
        with_import_sdk_fields: bool = True,
        user: User = None,
        task_response: TaskResponse = None
):
    await clear_demo_projects()
    await import_demo_projects(with_import_sdk_fields, user, task_response)
    if settings.is_env_production():
        send_demo_reset_notifications()


async def clear_demo_project(project_title: str):
    project: Project = await Project.find_one(Project.title == project_title)
    if project:
        await EFormsPackageImporter.clear_project_data(project)
        await project.delete()


async def clear_demo_projects():
    await clear_demo_project(PROJECT1_TITLE)
    await clear_demo_project(PROJECT2_TITLE)


async def import_ontologies_to_project(project_id: PydanticObjectId, user: User):
    with open(ONTOLOGY_FILE_PATH, 'r', encoding="utf-8") as file:
        await ontology_file_repository.create(
            project_id=project_id,
            ontology_file=OntologyFileResource(
                filename=ONTOLOGY_FILE_NAME,
                content=file.read(),
                created_at=datetime.now(tzlocal())
            )
        )
    await discover_and_save_terms(
        project_id=project_id,
        user=user,
        ontology_sources=None
    )


async def import_demo_project(
        project_path: pathlib.Path,
        project_title: str,
        has_package: bool = False,
        with_import_sdk_fields: bool = True,
        ignore_missing_resources: bool = False,
        user: User = None,
        task_response: TaskResponse = None
):
    mono_data = import_eforms_mapping_suite_from_file_system(
        project_path,
        ignore_missing_resources=ignore_missing_resources
    )
    project = Project(
        title=project_title,
        created_at=datetime.now(tzlocal())
    )
    await project.save()
    await import_ontologies_to_project(project.id, user)

    importer: EFormsPackageImporter = EFormsPackageImporter(project=project, user=user, task_response=task_response)
    importer.set_has_package(has_package)
    importer.set_with_import_sdk_fields(with_import_sdk_fields)
    importer.set_sdk_fields_github_repository_url(GITHUB_EFORMS_SDK_FIELDS_REPO_URL)

    await importer.import_from_mono_mapping_suite(mono_data)


async def import_demo_projects(
        with_import_sdk_fields: bool = True,
        user: User = None,
        task_response: TaskResponse = None
):
    await import_demo_project(PROJECT1_PATH, PROJECT1_TITLE, False, False, True, user, task_response)
    await import_demo_project(PROJECT2_PATH, PROJECT2_TITLE, True, with_import_sdk_fields, False, user, task_response)
