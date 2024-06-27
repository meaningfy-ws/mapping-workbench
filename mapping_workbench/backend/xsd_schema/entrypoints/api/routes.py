from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, HTTPException

from mapping_workbench.backend.project.models.entity import ProjectNotFoundException
from mapping_workbench.backend.xsd_schema.adapters.xsd_file_beanie_repository import XSDFileResourceBeanieRepository, \
    XSDFileResourceExistsException, XSDFileResourceNotFoundException
from mapping_workbench.backend.xsd_schema.models.xsd_file_resource import XSDFileResourceOut, XSDFileResourceIn, \
    XSDFileResource

XSD_SCHEMA_ROUTE_PREFIX = "/xsd_schema"
XSD_SCHEMA_FILE_ROUTE_PREFIX = "/xsd_files"
TAGS = ["xsd_schema"]

router = APIRouter(
    prefix=XSD_SCHEMA_ROUTE_PREFIX,
    tags=TAGS
)

xsd_file_repository = XSDFileResourceBeanieRepository()


@router.get(
    path=XSD_SCHEMA_FILE_ROUTE_PREFIX,
    description=f"Get all xsd files as a list",
    response_model=List[XSDFileResourceOut],
    status_code=status.HTTP_200_OK
)
async def route_get_list_of_xsd_files(
        project_id: PydanticObjectId,
) -> List[XSDFileResourceOut]:
    try:
        xsd_files = await xsd_file_repository.get_all(project_id)
    except ProjectNotFoundException as project_not_found_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(project_not_found_exception))
    return [XSDFileResourceOut(**xsd_file.dict()) for xsd_file in xsd_files]


@router.get(
    path=XSD_SCHEMA_FILE_ROUTE_PREFIX + "/{xsd_file_name}",
    description=f"Get xsd file by name",
    response_model=XSDFileResourceOut,
    status_code=status.HTTP_200_OK
)
async def route_get_xsd_file_by_id(
        project_id: PydanticObjectId,
        xsd_file_name: str
) -> XSDFileResourceOut:
    try:
        xsd_file = await xsd_file_repository.get_by_id(project_id=project_id, xsd_file_name=xsd_file_name)
    except (ProjectNotFoundException,
            XSDFileResourceNotFoundException
            ) as expected_exceptions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exceptions))
    return XSDFileResourceOut(**xsd_file.dict())


@router.delete(
    path=XSD_SCHEMA_FILE_ROUTE_PREFIX + "/{xsd_file_name}",
    description=f"Delete xsd file by name",
    response_model=None,
    status_code=status.HTTP_200_OK
)
async def route_delete_xsd_file_by_id(
        project_id: PydanticObjectId,
        xsd_file_name: str
) -> None:
    try:
        await xsd_file_repository.delete(project_id, xsd_file_name)
    except (ProjectNotFoundException,
            XSDFileResourceNotFoundException
            ) as expected_exceptions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exceptions))
    return None


@router.post(
    path=XSD_SCHEMA_FILE_ROUTE_PREFIX,
    description=f"Create XSD File",
    response_model=None,
    status_code=status.HTTP_201_CREATED
)
async def route_create_xsd_file(
        project_id: PydanticObjectId,
        xsd_file: XSDFileResourceIn
) -> None:
    try:
        await xsd_file_repository.create(project_id=project_id, xsd_file=XSDFileResource(**xsd_file.model_dump()))
    except (
            XSDFileResourceExistsException,
            ProjectNotFoundException
    ) as expected_exceptions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exceptions))
    return None
