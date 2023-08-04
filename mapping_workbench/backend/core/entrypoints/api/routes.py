from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get(
    "/",
    name="index"
)
async def index(request: Request) -> JSONResponse:
    return JSONResponse(content={
        "message": "Welcome to Mapping Workbench API!"
    })
