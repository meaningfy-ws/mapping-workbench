from fastapi import APIRouter

from mapping_workbench.backend.core.models.crud_routes import CRUDRoutes
from mapping_workbench.backend.core.services.crud_api_router import CRUDApiRouter
from mapping_workbench.backend.project.models.entity import Project

crud_api_router: CRUDApiRouter[Project] = CRUDApiRouter(Project)
router: APIRouter = crud_api_router.init_router(
    entity_routes=CRUDRoutes()
)
