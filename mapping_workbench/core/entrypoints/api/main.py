from enum import Enum

from fastapi import FastAPI

from mapping_workbench.mapping_suite.entrypoints.api import routes as mapping_suite_routes


class APIResponseType(Enum):
    JSON = "json"
    RAW = "raw"


app = FastAPI()


@app.get("/")
async def home():
    return {"message": "Hello World"}

app.include_router(mapping_suite_routes.router, prefix="/v1", tags=["mapping_suites"])
