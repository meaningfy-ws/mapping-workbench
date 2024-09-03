from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException
from fastapi import status

from mapping_workbench.backend.conceptual_mapping_group.adapters.cmg_beanie_repository import CMGBeanieRepository, \
    CMGBeanieRepositoryException
from mapping_workbench.backend.conceptual_mapping_group.models.conceptual_mapping_group import \
    ConceptualMappingGroupNameListOut

CMG_ROUTE_PREFIX = "/conceptual_mapping_group"

TAGS = ["conceptual_mapping_group"]

router = APIRouter(
    prefix=CMG_ROUTE_PREFIX,
    tags=TAGS
)

cm_group_repository = CMGBeanieRepository()


@router.get(
    path="",
    description=f"Get list of cm groups id's",
    response_model=ConceptualMappingGroupNameListOut,
    status_code=status.HTTP_200_OK
)
async def route_get_list_of_conceptual_mapping_group(
        project_id: PydanticObjectId,
) -> ConceptualMappingGroupNameListOut:
    try:
        cm_groups = await cm_group_repository.get_all(project_id)
        return ConceptualMappingGroupNameListOut(items=cm_groups)
    except (CMGBeanieRepositoryException,) as expected_exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(expected_exception))
