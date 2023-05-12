from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
#from motor.motor_asyncio import AsyncIOMotorClient

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.config.entrypoints.api import routes as config_routes
from mapping_workbench.backend.core.entrypoints.api import routes as core_routes
from mapping_workbench.backend.project.entrypoints.api import routes as mapping_suite_routes
from mapping_workbench.backend.user.entrypoints.api import routes as user_routes
#from mapping_workbench.database.adapters.mongodb import client as mongodb_client, database as mongodb_database


ROOT_API_PATH = "/api/v1"

app = FastAPI(
    title="Mapping Workbench",
    openapi_url=f"{ROOT_API_PATH}/docs/openapi.json",
    docs_url=f"{ROOT_API_PATH}/docs",
    redoc_url=f"{ROOT_API_PATH}/docs/redoc",
    swagger_ui_oauth2_redirect_url=f"{ROOT_API_PATH}/docs/oauth2-redirect"
)

# origins = [f"{settings.HOST}:{settings.PORT}"]

app.add_middleware(
    CORSMiddleware,
    #allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.mongodb_client = None
#
#
# @app.on_event("startup")
# async def startup_db_client():
#     app.mongodb_client = mongodb_client
#     app.mongodb = mongodb_database
#
#
# @app.on_event("shutdown")
# async def shutdown_db_client():
#     app.mongodb_client.close()


app_router = APIRouter()
app_router.include_router(core_routes.router, tags=["default"])
app_router.include_router(config_routes.router)
app_router.include_router(mapping_suite_routes.router)
app_router.include_router(user_routes.router, tags=["users"])
app.include_router(app_router, prefix=ROOT_API_PATH)
