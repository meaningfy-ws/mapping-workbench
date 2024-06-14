from beanie import PydanticObjectId
from fastapi import APIRouter, status, Form, UploadFile, Depends

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.services import tasks
from mapping_workbench.backend.package_importer.services.import_mapping_suite import \
    import_mapping_package_from_archive, clear_project_data
from mapping_workbench.backend.package_importer.services.importer import import_package
from mapping_workbench.backend.project.services.api import get_project
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.task_manager.services.task_wrapper import add_task
from mapping_workbench.backend.user.models.user import User

ROUTE_PREFIX = "/package_importer"
TAG = "package_importer"
NAME_FOR_ONE = "package"

TASK_IMPORT_PACKAGE_NAME = f"{NAME_FOR_ONE}:tasks:import"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)


@router.post(
    "/import",
    description=f"Import {NAME_FOR_ONE}",
    name=f"{NAME_FOR_ONE}:import",
    status_code=status.HTTP_201_CREATED
)
async def route_import_package(
        project: PydanticObjectId = Form(...),
        file: UploadFile = Form(...),
        user: User = Depends(current_active_user)
):
    mapping_package: MappingPackage = await import_package(
        file.file.read(), file.filename, await get_project(project), user
    )

    return mapping_package.model_dump()


@router.post(
    "/clear_project_data/{id}"
)
async def route_clear_project_data(
        id: PydanticObjectId
):
    await clear_project_data(await get_project(id))


@router.post(
    "/import/archive",
    description=f"Import {NAME_FOR_ONE} Archive",
    name=f"{NAME_FOR_ONE}:import_archive",
    status_code=status.HTTP_201_CREATED
)
async def route_import_package_archive(
        project: PydanticObjectId = Form(...),
        file: UploadFile = Form(...),
        user: User = Depends(current_active_user)
):
    mapping_package: MappingPackage = await import_mapping_package_from_archive(
        file.file.read(), await get_project(project), user
    )

    return mapping_package.model_dump()


@router.post(
    "/tasks/import",
    description=f"Task Import {NAME_FOR_ONE}",
    name=TASK_IMPORT_PACKAGE_NAME,
    status_code=status.HTTP_201_CREATED
)
async def route_task_import_package(
        project: PydanticObjectId = Form(...),
        file: UploadFile = Form(...),
        user: User = Depends(current_active_user)
):
    return add_task(
        tasks.task_import_mapping_package,
        f"Importing package from {file.filename} archive",
        None,
        user.email,
        file.file.read(), await get_project(project), user
    )
