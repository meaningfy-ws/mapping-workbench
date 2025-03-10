from fastapi import APIRouter, Depends
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from mapping_workbench.backend.conceptual_mapping_rule.entrypoints.api import routes as conceptual_mapping_rule_routes
from mapping_workbench.backend.config import settings
from mapping_workbench.backend.config.entrypoints.api import routes as config_routes
from mapping_workbench.backend.core.entrypoints.api import routes as core_routes
from mapping_workbench.backend.core.services.project_initilisers import init_project_models, init_admin_user
from mapping_workbench.backend.database.adapters.mongodb import DB
from mapping_workbench.backend.fields_registry.entrypoints.api import routes as fields_registry
from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.mapping_package.entrypoints.api import routes as mapping_package_routes
from mapping_workbench.backend.mapping_rule_registry.entrypoints.api import routes as mapping_rule_registry_routes
from mapping_workbench.backend.ontology.entrypoints.api import routes as ontology_routes
from mapping_workbench.backend.ontology_suite.entrypoints.api.routes import ontology_files_router
from mapping_workbench.backend.package_exporter.entrypoints.api import routes as package_exporter_routes
from mapping_workbench.backend.package_importer.entrypoints.api import routes as package_importer_routes
from mapping_workbench.backend.package_processor.entrypoints.api import routes as package_processor_routes
from mapping_workbench.backend.package_validator.entrypoints.api import routes as package_validator_routes
from mapping_workbench.backend.project.entrypoints.api import routes as project_routes
from mapping_workbench.backend.resource_collection.entrypoints.api import routes as resource_collection_routes
from mapping_workbench.backend.security.entrypoints.api import routes as security_routes
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.shacl_test_suite.entrypoints.api import routes as shacl_test_suite_routes
from mapping_workbench.backend.sparql_test_suite.entrypoints.api import routes as sparql_test_suite_routes
from mapping_workbench.backend.task_manager.entrypoints.api import routes as task_manager_routes
from mapping_workbench.backend.tasks.entrypoints.api import routes as tasks_routes
from mapping_workbench.backend.test_data_suite.entrypoints.api import routes as test_data_suite_routes
from mapping_workbench.backend.conceptual_mapping_group.entrypoints.api import routes as cm_groups_routes
from mapping_workbench.backend.triple_map_fragment.entrypoints.api import \
    routes_for_generic as generic_triple_map_fragment_routes
from mapping_workbench.backend.triple_map_fragment.entrypoints.api import \
    routes_for_specific as specific_triple_map_fragment_routes
from mapping_workbench.backend.triple_map_registry.entrypoints.api import routes as triple_map_registry_routes
from mapping_workbench.backend.user.entrypoints.api import routes as user_routes
from mapping_workbench.backend.xsd_schema.entrypoints.api import routes as xsd_schema_routes
from mapping_workbench.backend.demo.entrypoints.api import routes as demo_routes

ROOT_API_PATH = "/api/v1"

app = FastAPI(
    title="Mapping Workbench",
    openapi_url=f"{ROOT_API_PATH}/docs/openapi.json",
    docs_url=f"{ROOT_API_PATH}/docs",
    redoc_url=f"{ROOT_API_PATH}/docs/redoc",
    swagger_ui_oauth2_redirect_url=f"{ROOT_API_PATH}/docs/oauth2-redirect"
)

origins = ["*"]

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
    await init_admin_user()


app_router = APIRouter()

app_public_router = APIRouter()
app_router.include_router(app_public_router)

app_secured_router = APIRouter(dependencies=[Depends(current_active_user)])

ontology_routes.router.include_router(ontology_files_router)

secured_routers: list = [
    core_routes.router,
    project_routes.router,
    test_data_suite_routes.router,
    sparql_test_suite_routes.router,
    shacl_test_suite_routes.router,
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
    tasks_routes.router,  # Deprecated
    fields_registry.router,
    xsd_schema_routes.router,
    cm_groups_routes.router,
    demo_routes.router
]

for secured_router in secured_routers:
    app_secured_router.include_router(secured_router)

app_router.include_router(app_secured_router)

app_router.include_router(security_routes.router)
app_router.include_router(user_routes.router)

app.include_router(app_router, prefix=ROOT_API_PATH)

if not settings.is_env_production():
    @app.exception_handler(Exception)
    async def all_exception_handler(request: Request, exception: Exception):
        exception_traceback = str(exception) or "No traceback available"
        mwb_logger.log_all_error(f"Unexpected error of type: {exception.__class__.__name__}",
                                 stack_trace=exception_traceback)
        return JSONResponse(
            status_code=500,
            content={
                "detail": [{"msg": f"Exception name: {exception.__class__.__name__} Error: {exception_traceback}"}]
            },
            headers={"Access-Control-Allow-Origin": "*"}  # Allow all is a temporary solution
        )
