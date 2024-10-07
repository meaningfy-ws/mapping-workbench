from typing import Dict, List

from beanie import PydanticObjectId
from beanie.odm.operators.find.comparison import In

from mapping_workbench.backend.user.models.query_filters import QueryFilters
from mapping_workbench.backend.user.models.user import User, UserApp, UserOut, Role


async def list_users(query: QueryFilters = None) -> list[UserOut]:
    return await User.find(query.model_dump(exclude_unset=True), fetch_links=False, projection_model=UserOut).to_list()


async def set_project_for_current_user_session(id: PydanticObjectId, user: User) -> PydanticObjectId:
    user.settings.session.project = id
    await user.save()
    return id


async def set_app_settings_for_current_user(data: Dict, user: User):
    user_app = user.settings.app or UserApp()
    user_app.settings = data
    user.settings.app = user_app
    await user.save()


async def update_users_roles(user_ids: List[PydanticObjectId], roles: List[Role], user: User):
    await User.find(In(User.id, user_ids)).update_many({"$set": {User.roles: roles}})


async def activate_users(user_ids: List[PydanticObjectId], user: User):
    await User.find(In(User.id, user_ids)).update_many({"$set": {User.is_active: True}})


async def deactivate_users(user_ids: List[PydanticObjectId], user: User):
    await User.find(In(User.id, user_ids)).update_many({"$set": {User.is_active: False}})


async def verify_users(user_ids: List[PydanticObjectId], user: User):
    await User.find(In(User.id, user_ids)).update_many({"$set": {User.is_verified: True}})


async def unverify_users(user_ids: List[PydanticObjectId], user: User):
    await User.find(In(User.id, user_ids)).update_many({"$set": {User.is_verified: False}})
