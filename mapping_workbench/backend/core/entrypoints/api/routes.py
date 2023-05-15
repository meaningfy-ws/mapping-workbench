from bson import ObjectId
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from mapping_workbench.backend.project.models.project import Project

router = APIRouter()


@router.get("/")
async def index(request: Request) -> JSONResponse:
    print("K2 :: ")
    #print("K :: ", ObjectId())
    project: Project = Project(identifier="P1", title="T1")
    return JSONResponse(content={
        "message": "Welcome to Mapping Workbench API!",
        "project": project.dict()
    })
