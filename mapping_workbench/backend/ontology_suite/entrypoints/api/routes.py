from typing import List

from beanie import PydanticObjectId
from fastapi import APIRouter, status, HTTPException

from mapping_workbench.backend.ontology_suite.adapters.ontology_file_beanie_repository import \
    OntologyFileResourceBeanieRepository, OntologyFileResourceNotFoundException, OntologyFileResourceExistsException
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResourceOut, \
    OntologyFileResourceIn, OntologyFileResource
from mapping_workbench.backend.project.models.entity import ProjectNotFoundException

ONTOLOGY_FILE_ROUTE_PREFIX = "/ontology_files"

ontology_file_repository = OntologyFileResourceBeanieRepository()

ontology_files_router = APIRouter(
    prefix=ONTOLOGY_FILE_ROUTE_PREFIX,
    tags=["ontology_files"]
)


@ontology_files_router.get(
    path="",
    description=f"Get all ontology files as a list",
    response_model=List[OntologyFileResourceOut],
    status_code=status.HTTP_200_OK
)
async def route_get_list_of_ontology_files(
        project_id: PydanticObjectId,
) -> List[OntologyFileResourceOut]:
    try:
        ontology_files = await ontology_file_repository.get_all(project_id)
    except ProjectNotFoundException as project_not_found_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(project_not_found_exception))
    return [OntologyFileResourceOut(**ontology_file.dict()) for ontology_file in ontology_files]


@ontology_files_router.get(
    path="/{ontology_file_name}",
    description=f"Get ontology file by name",
    response_model=OntologyFileResourceOut,
    status_code=status.HTTP_200_OK
)
async def route_get_ontology_file_by_id(
        project_id: PydanticObjectId,
        ontology_file_name: str
) -> OntologyFileResourceOut:
    try:
        ontology_file = await ontology_file_repository.get_by_id(project_id=project_id,
                                                                 ontology_file_name=ontology_file_name)
    except (
            ProjectNotFoundException,
            OntologyFileResourceNotFoundException
    ) as expected_exceptions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exceptions))
    return OntologyFileResourceOut(**ontology_file.dict())


@ontology_files_router.delete(
    path="/{ontology_file_name}",
    description=f"Delete ontology file by name",
    response_model=None,
    status_code=status.HTTP_200_OK
)
async def route_delete_ontology_file_by_id(
        project_id: PydanticObjectId,
        ontology_file_name: str
) -> None:
    try:
        await ontology_file_repository.delete(project_id, ontology_file_name)
    except (ProjectNotFoundException,
            OntologyFileResourceNotFoundException
            ) as expected_exceptions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exceptions))
    return None


@ontology_files_router.post(
    path="",
    description=f"Create ontology file",
    response_model=None,
    status_code=status.HTTP_201_CREATED
)
async def route_create_ontology_file(
        project_id: PydanticObjectId,
        ontology_file: OntologyFileResourceIn
) -> None:
    try:
        await ontology_file_repository.create(project_id=project_id,
                                              ontology_file=OntologyFileResource(**ontology_file.dict()))
    except (
            OntologyFileResourceExistsException,
            ProjectNotFoundException
    ) as expected_exceptions:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exceptions))
    return None
