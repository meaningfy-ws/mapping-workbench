from fastapi import APIRouter, Body, status, Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from mapping_workbench.backend.project.models.project import Project

ROUTE_PREFIX = "/projects"
TAG = "projects"

sub_router = APIRouter()


@sub_router.get("", description="List all projects")
async def get_projects() -> JSONResponse:
    return JSONResponse(content=[Project(name="ASSA").dict()])


@sub_router.post("", description="Add new project")
async def create_project(request: Request, project: Project = Body(...)) -> JSONResponse:
    project = jsonable_encoder(project)
    collection_name = Project.get_collection_name()
    print("K :: ", collection_name)
    new_project = await request.app.mongodb[collection_name].insert_one(project)
    created_task = await request.app.mongodb[collection_name].find_one(
        {"_id": new_project.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_task)


@sub_router.put("/{identifier}")
async def update_project(identifier: str, project: Project) -> JSONResponse:
    collection.find_one_and_update(
        {
            "identifier": identifier
        },
        {
            "$set": project.dict()
        }
    )
    project_orm: MappingSuiteORM = MappingSuiteORM(**collection.find_one({"identifier": identifier}))
    return JSONResponse(content=Project.from_orm(project_orm).dict())


@sub_router.patch("/{identifier}")
async def patch_project(identifier: str, patch: dict) -> JSONResponse:
    collection.find_one_and_update(
        {
            "identifier": identifier
        },
        {
            "$set": patch
        }
    )
    project_orm: MappingSuiteORM = MappingSuiteORM(**collection.find_one({"identifier": identifier}))
    return JSONResponse(content=Project.from_orm(project_orm).dict())


@sub_router.get("/{identifier}")
async def get_project(identifier: str) -> JSONResponse:
    project_orm: MappingSuiteORM = MappingSuiteORM(**collection.find_one({"identifier": identifier}))
    return JSONResponse(content=Project.from_orm(project_orm).dict())


@sub_router.delete("/{identifier}")
async def delete_project(identifier: str):
    collection.find_one_and_delete({"identifier": identifier})
    return JSONResponse(content={"identifier": identifier})


router = APIRouter()
router.include_router(sub_router, prefix=ROUTE_PREFIX, tags=[TAG])
