import json
from hashlib import sha1
from typing import Type, Optional

from mapping_workbench.backend.database.adapters.gridfs_storage import AsyncGridFSStorage
from mapping_workbench.backend.state_manager.models.state_object import ObjectState, ObjectStateType


async def save_object_state(object_state: ObjectState) -> str:
    """
    Saves the state of an object to the database and return the saved state id.
    :param object_state: The state of the object to save.
    :return: The id of the saved state.
    """
    state_content_dump = object_state.model_dump_json()
    file_name = str(sha1(state_content_dump.encode("utf-8")).hexdigest())
    grids_fs_state_id = await AsyncGridFSStorage.upload_file(file_name, state_content_dump)
    return grids_fs_state_id


async def load_object_state(state_id: str, object_class: Type[ObjectStateType]) -> Optional[ObjectStateType]:
    """
    Loads the state of an object from the database.
    :param state_id: The id of the state to load.
    :param object_class: The class of the object to load.
    :return: The loaded object.
    """
    state_content_dump = await AsyncGridFSStorage.download_file(state_id)
    if state_content_dump is None:
        return None
    return object_class(**json.loads(state_content_dump))


async def delete_object_state(state_id: str):
    """
    Deletes the state of an object from the database.
    :param state_id: The id of the state to delete.
    :return: None
    """
    return await AsyncGridFSStorage.delete_file(state_id)
