from typing import List

from mapping_workbench.backend.core.models.api_request import APIRequestWithIds
from mapping_workbench.backend.user.models.user import Role


class APIUsersUpdateRolesRequest(APIRequestWithIds):
    roles: List[Role]
