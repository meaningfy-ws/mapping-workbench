from typing import Any, Optional, Dict

from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

UNPROCESSABLE_ENTITY_ERROR = "Unprocessable Entity"


class InvalidResourceException(Exception):
    def __init__(self, message=None):
        self.message = message
        super().__init__("Invalid Resource :: " + self.message)


class InvalidPackageTypeException(Exception):
    def __init__(self, message=None):
        self.message = message
        super().__init__(self.message)



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
        details = str(e.details['keyValue']) if hasattr(e, 'details') else str(e)
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Duplicate key: {details}!"
        )


class ResourceConflictException(HTTPException):
    def __init__(
            self,
            status_code: int = None,
            detail: Any = None,
            headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            status_code=(status_code or status.HTTP_409_CONFLICT),
            detail=(detail or "Resource exists!"),
            headers=headers
        )



class FailedDependency(HTTPException):
    def __init__(
            self,
            status_code: int = None,
            detail: Any = None,
            headers: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            status_code=(status_code or status.HTTP_424_FAILED_DEPENDENCY),
            detail=(detail or "Failed Dependency"),
            headers=headers
        )