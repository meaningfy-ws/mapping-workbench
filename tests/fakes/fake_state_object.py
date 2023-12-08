from mapping_workbench.backend.state_manager.models.state_object import ObjectState


class FakeObjectState(ObjectState):
    """
    Fake class to store the state of an object.
    """
    name: str = "fake_object_state"
    object_data: str = "fake_object_data"
