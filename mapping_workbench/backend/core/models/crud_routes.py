from pydantic import BaseModel


class CRUDRoutes(BaseModel):
    has_route_get_all: bool = True
    has_route_create: bool = True
    has_route_get_one: bool = True
    has_route_update_one: bool = True
    has_route_delete_one: bool = True


class CRUDFileResourceRoutes(BaseModel):
    has_route_get_all: bool = True
    has_route_create_one: bool = True
    has_route_create_many: bool = True
    has_route_get_one: bool = True
    has_route_update_one: bool = True
    has_route_delete_one: bool = True
    has_route_delete_many: bool = True
