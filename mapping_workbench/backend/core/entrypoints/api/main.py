from beanie import init_beanie
from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from httpx_oauth.clients.google import GoogleOAuth2

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.config.entrypoints.api import routes as config_routes
from mapping_workbench.backend.core.entrypoints.api import routes as core_routes
from mapping_workbench.backend.database.adapters.mongodb import DB
from mapping_workbench.backend.project.entrypoints.api import routes as project_routes
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.test_data_suite.entrypoints.api import routes as test_data_suite_routes
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite
from mapping_workbench.backend.test_data_suite.models.file_resource import TestDataFileResource
from mapping_workbench.backend.sparql_test_suite.entrypoints.api import routes as sparql_test_suite_routes
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite
from mapping_workbench.backend.sparql_test_suite.models.file_resource import SPARQLTestFileResource
from mapping_workbench.backend.user.entrypoints.api import routes as user_routes
from mapping_workbench.backend.user.models.user import User
from mapping_workbench.backend.security.models.security import AccessToken
from mapping_workbench.backend.security.entrypoints.api import routes as security_routes
from mapping_workbench.backend.security.services.user_manager import current_active_user

ROOT_API_PATH = "/api/v1"

google_oauth_client = GoogleOAuth2("CLIENT_ID", "CLIENT_SECRET")

app = FastAPI(
    title="Mapping Workbench",
    openapi_url=f"{ROOT_API_PATH}/docs/openapi.json",
    docs_url=f"{ROOT_API_PATH}/docs",
    redoc_url=f"{ROOT_API_PATH}/docs/redoc",
    swagger_ui_oauth2_redirect_url=f"{ROOT_API_PATH}/docs/oauth2-redirect"
)

origins = [f"{settings.HOST}:{settings.PORT}", "http://localhost:3000", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.on_event("startup")
async def on_startup():
    await init_beanie(
        database=DB.get_database(),
        document_models=[
            User,
            AccessToken,
            Project,
            TestDataSuite,
            TestDataFileResource,
            SPARQLTestSuite,
            SPARQLTestFileResource
        ],
    )


app_router = APIRouter()

app_public_router = APIRouter()
app_router.include_router(app_public_router)

app_secured_router = APIRouter(dependencies=[Depends(current_active_user)])
app_secured_router.include_router(core_routes.router)
app_secured_router.include_router(project_routes.router)
app_secured_router.include_router(test_data_suite_routes.router)
app_secured_router.include_router(sparql_test_suite_routes.router)
app_secured_router.include_router(config_routes.router)
app_router.include_router(app_secured_router)

app_router.include_router(security_routes.router)
app_router.include_router(user_routes.router)

app.include_router(app_router, prefix=ROOT_API_PATH)
