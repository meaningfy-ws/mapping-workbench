from typing import Any, Optional, Dict

from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError


class ResourceNotFoundException(HTTPException):
    def __init__(
            self,
            status_code: int = None,
            detail: Any = None,
            headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            status_code=(status_code or status.HTTP_404_NOT_FOUND),
            detail=(detail or "Resource not found!"),
            headers=headers
        )


class DuplicateKeyException(HTTPException):
    def __init__(
            self,
            e: DuplicateKeyError = None
    ) -> None:
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Duplicate key: {e.details['keyValue']}!"
        )