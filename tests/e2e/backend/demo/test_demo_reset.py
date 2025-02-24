import pytest

from mapping_workbench.backend.demo.services.data import reset_demo_data, PROJECT1_TITLE, PROJECT2_TITLE, \
    clear_demo_projects
from mapping_workbench.backend.project.models.entity import Project


@pytest.mark.asyncio
async def test_demo_reset():
    await reset_demo_data(with_import_sdk_fields=False)

    assert await Project.find_one(Project.title == PROJECT1_TITLE)
    assert await Project.find_one(Project.title == PROJECT2_TITLE)

    await clear_demo_projects()

    assert not await Project.find_one(Project.title == PROJECT1_TITLE)
    assert not await Project.find_one(Project.title == PROJECT2_TITLE)
