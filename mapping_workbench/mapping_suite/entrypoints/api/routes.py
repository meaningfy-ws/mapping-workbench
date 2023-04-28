from typing import List

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from mapping_workbench.core.adapters.mongo_db import db
from mapping_workbench.mapping_suite.model.mapping_suite import MappingSuiteORM, MappingSuite

collection = db['mapping_suites']

router = APIRouter()


@router.get("/mapping_suites/")
async def get_mapping_suites() -> List[MappingSuite]:
    return [MappingSuite.from_orm(MappingSuiteORM(**item)) for item in collection.find({})]


@router.post("/mapping_suites/")
async def create_mapping_suite(mapping_suite: MappingSuite) -> JSONResponse:
    collection.insert_one(mapping_suite.dict())
    mapping_suite_orm: MappingSuiteORM = MappingSuiteORM(**collection.find_one(
        {"identifier": mapping_suite.identifier}
    ))
    return JSONResponse(content=MappingSuite.from_orm(mapping_suite_orm).dict())


@router.put("/mapping_suites/{identifier}")
async def update_mapping_suite(identifier: str, mapping_suite: MappingSuite) -> JSONResponse:
    collection.find_one_and_update(
        {
            "identifier": identifier
        },
        {
            "$set": mapping_suite.dict()
        }
    )
    mapping_suite_orm: MappingSuiteORM = MappingSuiteORM(**collection.find_one({"identifier": identifier}))
    return JSONResponse(content=MappingSuite.from_orm(mapping_suite_orm).dict())


@router.patch("/mapping_suites/{identifier}")
async def patch_mapping_suite(identifier: str, patch: dict) -> JSONResponse:
    collection.find_one_and_update(
        {
            "identifier": identifier
        },
        {
            "$set": patch
        }
    )
    mapping_suite_orm: MappingSuiteORM = MappingSuiteORM(**collection.find_one({"identifier": identifier}))
    return JSONResponse(content=MappingSuite.from_orm(mapping_suite_orm).dict())


@router.get("/mapping_suites/{identifier}")
async def get_mapping_suite(identifier: str) -> JSONResponse:
    mapping_suite_orm: MappingSuiteORM = MappingSuiteORM(**collection.find_one({"identifier": identifier}))
    return JSONResponse(content=MappingSuite.from_orm(mapping_suite_orm).dict())


@router.delete("/mapping_suites/{identifier}")
async def delete_mapping_suite(identifier: str):
    collection.find_one_and_delete({"identifier": identifier})
    return JSONResponse(content={"identifier": identifier})
