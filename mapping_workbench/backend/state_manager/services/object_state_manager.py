import asyncio
import orjson
from hashlib import sha1
from typing import Type, Optional

from bson import ObjectId
from cachetools import TTLCache

from mapping_workbench.backend.database.adapters.gridfs_storage import AsyncGridFSStorage
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, ObjectStateType

# Cache for loaded state objects: 50 states max, 5 minute TTL
_state_cache: TTLCache = TTLCache(maxsize=50, ttl=300)
_cache_lock = asyncio.Lock()


async def save_object_state(object_state: ObjectState) -> ObjectId:
    """
    Saves the state of an object to the database and return the saved state id.
    :param object_state: The state of the object to save.
    :return: The id of the saved state.
    """
    state_content_dump = object_state.model_dump_json()
    file_name = str(sha1(state_content_dump.encode("utf-8")).hexdigest())
    grids_fs_state_id: ObjectId = await AsyncGridFSStorage.upload_file(file_name, state_content_dump)
    return grids_fs_state_id


async def load_object_state(state_id: ObjectId, object_class: Type[ObjectStateType]) -> Optional[ObjectStateType]:
    """
    Loads the state of an object from the database with caching.
    :param state_id: The id of the state to load.
    :param object_class: The class of the object to load.
    :return: The loaded object.
    """
    cache_key = str(state_id)

    # Check cache first
    if cache_key in _state_cache:
        return _state_cache[cache_key]

    state_content_dump = await AsyncGridFSStorage.download_file(state_id)

    if state_content_dump is None:
        return None

    # Use model_validate for proper nested model construction
    # (model_construct doesn't recursively construct nested models)
    result = object_class.model_validate(orjson.loads(state_content_dump))

    # Cache the result
    async with _cache_lock:
        _state_cache[cache_key] = result

    return result


def invalidate_state_cache(state_id: ObjectId) -> None:
    """
    Invalidate a cached state when it's updated or deleted.
    :param state_id: The id of the state to invalidate.
    """
    cache_key = str(state_id)
    if cache_key in _state_cache:
        del _state_cache[cache_key]


async def delete_object_state(state_id: ObjectId):
    """
    Deletes the state of an object from the database.
    :param state_id: The id of the state to delete.
    :return: None
    """
    invalidate_state_cache(state_id)
    return await AsyncGridFSStorage.delete_file(state_id)
