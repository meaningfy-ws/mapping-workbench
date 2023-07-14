from fastapi import APIRouter

from mapping_workbench.backend.core.services.entities_for_api import CRUDApiRouter
from mapping_workbench.backend.project.models.entity import Project, ProjectIn, ProjectOut

crud_api_router: CRUDApiRouter[Project] = CRUDApiRouter(Project)

router: APIRouter = crud_api_router.init_router()


#
#
# @router.patch(
#     "/{id}",
#     name="projects:update_project",
#     response_model=Project
# )
# async def update_project(
#         id: PydanticObjectId,
#         data: Dict,
#         user: User = Depends(current_active_user)
# ) -> JSONResponse:
#     await update_project_for_api(id, data, user=user)
#     data = await get_project_for_api(id)
#     return JSONResponse(
#         status_code=status.HTTP_200_OK,
#         content=jsonable_encoder(data)
#     )
#
#
# @router.get(
#     "/{id}",
#     name="projects:get_project",
#     response_model=Project
# )
# async def get_project(id: PydanticObjectId) -> JSONResponse:
#     data = await get_project_for_api(id)
#
#     return JSONResponse(
#         status_code=status.HTTP_200_OK,
#         content=jsonable_encoder(data)
#     )
#
#
# @router.delete(
#     "/{id}",
#     name="projects:delete_project",
#     response_model=JSONEmptyContentWithId
# )
# async def delete_project(id: PydanticObjectId):
#     await delete_project_for_api(id)
#     return JSONResponse(
#         status_code=status.HTTP_200_OK,
#         content=jsonable_encoder(JSONEmptyContentWithId(_id=id))
#     )
