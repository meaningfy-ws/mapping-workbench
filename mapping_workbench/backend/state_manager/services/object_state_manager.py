import json
from hashlib import sha1
from typing import Type, Optional

from mapping_workbench.backend.database.adapters.gridfs_storage import AsyncGridFSStorage
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, ObjectStateType


async def save_object_state(object_state: ObjectState) -> str:
    """
    Saves the state of an object to the database and return the saved state id.
    """
    state_content_dump = object_state.model_dump_json()
    state_id = sha1(state_content_dump.encode("utf-8")).hexdigest()
    await AsyncGridFSStorage.upload_file(state_id, state_content_dump)
    return state_id


async def load_object_state(state_id: str, object_class: Type[ObjectStateType]) -> Optional[ObjectStateType]:
    """
    Loads the state of an object from the database.
    """
    state_content_dump = await AsyncGridFSStorage.download_file(state_id)
    return object_class(**json.loads(state_content_dump))


async def delete_object_state(state_id: str):
    """
    Deletes the state of an object from the database.
    """
    return await AsyncGridFSStorage.delete_file(state_id)
