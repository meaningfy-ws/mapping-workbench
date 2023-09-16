from typing import List, Dict

from beanie import PydanticObjectId

from mapping_workbench.backend.user.models.query_filters import QueryFilters
from mapping_workbench.backend.user.models.user import User, UserApp


async def list_users(query: QueryFilters = None) -> List[User]:
    return await User.find(query.dict(exclude_unset=True), fetch_links=False).to_list()


async def set_project_for_current_user_session(id: PydanticObjectId, user: User) -> PydanticObjectId:
    user.settings.session.project = id
    await user.save()
    return id


async def set_app_settings_for_current_user(data: Dict, user: User):
    user_app = user.settings.app or UserApp()
    user_app.settings = data
    user.settings.app = user_app
    await user.save()
