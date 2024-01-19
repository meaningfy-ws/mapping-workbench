from fastapi import APIRouter

ROUTE_PREFIX = "/package_transformer"
TAG = "package_transformer"
NAME_FOR_ONE = "package"

router = APIRouter(
    prefix=ROUTE_PREFIX,
    tags=[TAG]
)
