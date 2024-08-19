from beanie import PydanticObjectId
from fastapi import APIRouter
from fastapi import status

from mapping_workbench.backend.conceptual_mapping_group.adapters.cmg_beanie_repository import CMGBeanieRepository
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
    cm_groups = await cm_group_repository.get_all(project_id)
    return ConceptualMappingGroupNameListOut(items=cm_groups)
