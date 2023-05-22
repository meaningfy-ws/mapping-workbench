from typing import List

from mapping_workbench.backend.user.models.query_filters import QueryFilters
from mapping_workbench.backend.user.models.user import User


async def list_users(query: QueryFilters = None) -> List[User]:
    return await User.find(query.dict(exclude_unset=True), fetch_links=False).to_list()
