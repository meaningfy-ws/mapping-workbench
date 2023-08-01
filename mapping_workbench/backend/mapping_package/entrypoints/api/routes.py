from fastapi import APIRouter

from mapping_workbench.backend.core.services.crud_api_router import CRUDApiRouter
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage

crud_api_router: CRUDApiRouter[MappingPackage] = CRUDApiRouter(MappingPackage)
router: APIRouter = crud_api_router.init_router()
