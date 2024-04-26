from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from httpx_oauth.clients.google import GoogleOAuth2

from mapping_workbench.backend.fields_registry.entrypoints.api import routes as fields_registry
from mapping_workbench.backend.conceptual_mapping_rule.entrypoints.api import routes as conceptual_mapping_rule_routes
from mapping_workbench.backend.config import settings
from mapping_workbench.backend.config.entrypoints.api import routes as config_routes
from mapping_workbench.backend.core.entrypoints.api import routes as core_routes
from mapping_workbench.backend.core.services.project_initilisers import init_project_models
from mapping_workbench.backend.database.adapters.mongodb import DB
from mapping_workbench.backend.mapping_package.entrypoints.api import routes as mapping_package_routes
from mapping_workbench.backend.package_importer.entrypoints.api import routes as package_importer_routes
from mapping_workbench.backend.package_exporter.entrypoints.api import routes as package_exporter_routes
from mapping_workbench.backend.package_processor.entrypoints.api import routes as package_processor_routes
from mapping_workbench.backend.package_validator.entrypoints.api import routes as package_validator_routes
from mapping_workbench.backend.mapping_rule_registry.entrypoints.api import routes as mapping_rule_registry_routes
from mapping_workbench.backend.ontology.entrypoints.api import routes as ontology_routes
from mapping_workbench.backend.ontology_file_collection.entrypoints.api import routes as ontology_file_collection_routes
from mapping_workbench.backend.project.entrypoints.api import routes as project_routes
from mapping_workbench.backend.resource_collection.entrypoints.api import routes as resource_collection_routes
from mapping_workbench.backend.security.entrypoints.api import routes as security_routes
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.shacl_test_suite.entrypoints.api import routes as shacl_test_suite_routes
from mapping_workbench.backend.sparql_test_suite.entrypoints.api import routes as sparql_test_suite_routes
from mapping_workbench.backend.task_manager.entrypoints.api import routes as task_manager_routes
from mapping_workbench.backend.tasks.entrypoints.api import routes as tasks_routes
from mapping_workbench.backend.test_data_suite.entrypoints.api import routes as test_data_suite_routes
from mapping_workbench.backend.triple_map_fragment.entrypoints.api import \
    routes_for_generic as generic_triple_map_fragment_routes
from mapping_workbench.backend.triple_map_fragment.entrypoints.api import \
    routes_for_specific as specific_triple_map_fragment_routes
from mapping_workbench.backend.triple_map_registry.entrypoints.api import routes as triple_map_registry_routes
from mapping_workbench.backend.user.entrypoints.api import routes as user_routes

ROOT_API_PATH = "/api/v1"

google_oauth_client = GoogleOAuth2("CLIENT_ID", "CLIENT_SECRET")

app = FastAPI(
    title="Mapping Workbench",
    openapi_url=f"{ROOT_API_PATH}/docs/openapi.json",
    docs_url=f"{ROOT_API_PATH}/docs",
    redoc_url=f"{ROOT_API_PATH}/docs/redoc",
    swagger_ui_oauth2_redirect_url=f"{ROOT_API_PATH}/docs/oauth2-redirect"
)

origins = [f"{settings.HOST}:{settings.PORT}", f"*.mw.{settings.SUBDOMAIN}{settings.DOMAIN}", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.on_event("startup")
async def on_startup():
    await init_project_models(mongodb_database=DB.get_database())

app_router = APIRouter()

app_public_router = APIRouter()
app_router.include_router(app_public_router)

app_secured_router = APIRouter(dependencies=[Depends(current_active_user)])

secured_routers: list = [
    core_routes.router,
    project_routes.router,
    test_data_suite_routes.router,
    sparql_test_suite_routes.router,
    shacl_test_suite_routes.router,
    ontology_file_collection_routes.router,
    resource_collection_routes.router,
    mapping_package_routes.router,
    package_importer_routes.router,
    package_exporter_routes.router,
    package_processor_routes.router,
    package_validator_routes.router,
    mapping_rule_registry_routes.router,
    conceptual_mapping_rule_routes.router,
    triple_map_registry_routes.router,
    specific_triple_map_fragment_routes.router,
    generic_triple_map_fragment_routes.router,
    config_routes.router,
    ontology_routes.router,
    task_manager_routes.router,
    tasks_routes.router,
    fields_registry.router
]

for secured_router in secured_routers:
    app_secured_router.include_router(secured_router)

app_router.include_router(app_secured_router)

app_router.include_router(security_routes.router)
app_router.include_router(user_routes.router)

app.include_router(app_router, prefix=ROOT_API_PATH)
