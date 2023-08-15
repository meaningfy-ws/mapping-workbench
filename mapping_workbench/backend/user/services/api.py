from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.user.models.query_filters import QueryFilters
from mapping_workbench.backend.user.models.user import User


async def list_users(query: QueryFilters = None) -> List[User]:
    return await User.find(query.dict(exclude_unset=True), fetch_links=False).to_list()


async def set_project_for_current_user_session(id: PydanticObjectId, user: User) -> PydanticObjectId:
    user.settings.session.project = id
    await user.save()
    return id
