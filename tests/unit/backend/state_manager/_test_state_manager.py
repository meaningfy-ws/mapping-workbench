import pytest

from mapping_workbench.backend.state_manager.services.object_state_manager import save_object_state, load_object_state, \
    delete_object_state
from tests.fakes.fake_state_object import FakeObjectState


@pytest.mark.asyncio
async def test_object_state_manager():
    fake_object_state = FakeObjectState(name="Test1", object_data="Test2")
    fake_object_state_id = await save_object_state(fake_object_state)
    new_fake_object_state = await load_object_state(fake_object_state_id, FakeObjectState)
    assert new_fake_object_state.name == fake_object_state.name
    assert new_fake_object_state.object_data == fake_object_state.object_data
    await delete_object_state(fake_object_state_id)
    new_fake_object_state = await load_object_state(fake_object_state_id, FakeObjectState)
    assert new_fake_object_state is None