from fastapi import APIRouter

ROUTE_PREFIX = "/package_validator"
TAG = "package_validator"
NAME_FOR_ONE = "package"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)
