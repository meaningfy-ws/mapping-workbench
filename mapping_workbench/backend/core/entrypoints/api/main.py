from beanie import init_beanie
from fastapi import FastAPI, APIRouter, Depends, Security
from fastapi.security import (
    SecurityScopes
)
from fastapi.middleware.cors import CORSMiddleware
from httpx_oauth.clients.google import GoogleOAuth2
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from mapping_workbench.backend.config import settings
from mapping_workbench.backend.config.entrypoints.api import routes as config
from mapping_workbench.backend.core.entrypoints.api import routes as core
from mapping_workbench.backend.database.adapters.mongodb import DB
from mapping_workbench.backend.project.entrypoints.api import routes as project
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.security.entrypoints.api import routes as security
from mapping_workbench.backend.security.models.security import AccessToken
from mapping_workbench.backend.security.services.user_manager import current_active_user
from mapping_workbench.backend.sparql_test_suite.models.entity import SPARQLTestSuite, SPARQLTestFileResource
from mapping_workbench.backend.sparql_test_suite.entrypoints.api import routes as sparql_test_suite
from mapping_workbench.backend.ontology_file_collection.models.entity import OntologyFileCollection, \
    OntologyFileResource
from mapping_workbench.backend.ontology_file_collection.entrypoints.api import routes as ontology_file_collection
from mapping_workbench.backend.shacl_test_suite.models.entity import SHACLTestSuite, SHACLTestFileResource
from mapping_workbench.backend.shacl_test_suite.entrypoints.api import routes as shacl_test_suite
from mapping_workbench.backend.resource_collection.models.entity import ResourceCollection, ResourceFile
from mapping_workbench.backend.resource_collection.entrypoints.api import routes as resource_collection
from mapping_workbench.backend.test_data_suite.models.entity import TestDataSuite, TestDataFileResource
from mapping_workbench.backend.test_data_suite.entrypoints.api import routes as test_data_suite

from mapping_workbench.backend.user.entrypoints.api import routes as user
from mapping_workbench.backend.user.models.user import User

ROOT_API_PATH = "/api/v1"

google_oauth_client = GoogleOAuth2("CLIENT_ID", "CLIENT_SECRET")

app = FastAPI(title="Mapping Workbench")

origins = [f"{settings.HOST}:{settings.PORT}", "http://localhost:3000", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.on_event("startup")
async def app_init():
    app.db = DB.get_database()
    app.fs = AsyncIOMotorGridFSBucket(app.db)
    await init_beanie(
        database=app.db,
        document_models=[
            User,
            AccessToken,
            Project,
            OntologyFileCollection,
            OntologyFileResource,
            SPARQLTestSuite,
            SPARQLTestFileResource,
            SHACLTestSuite,
            SHACLTestFileResource,
            ResourceCollection,
            ResourceFile,
            TestDataSuite,
            TestDataFileResource
        ],
    )


app_router = APIRouter()

app_public_router = APIRouter()
app_router.include_router(app_public_router)

app_secured_router = APIRouter(dependencies=[Depends(current_active_user)])
app_secured_router.include_router(core.router)
app_secured_router.include_router(project.router)
app_secured_router.include_router(test_data_suite.router)
app_secured_router.include_router(sparql_test_suite.router)
app_secured_router.include_router(shacl_test_suite.router)
app_secured_router.include_router(ontology_file_collection.router)
app_secured_router.include_router(resource_collection.router)
app_secured_router.include_router(config.router)
app_router.include_router(app_secured_router)

app_router.include_router(security.router)
app_router.include_router(user.router)

app.include_router(app_router, prefix=ROOT_API_PATH)
