import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.project.models.entity import ProjectNotFoundException, ProjectCreateIn
from mapping_workbench.backend.project.services.api import create_project
from mapping_workbench.backend.xsd_schema.adapters.xsd_file_beanie_repository import XSDFileResourceBeanieRepository, \
    XSDFileResourceNotFoundException, XSDFileResourceExistsException
from mapping_workbench.backend.xsd_schema.models.xsd_file_resource import XSDFileResourceIn, XSDFileResource


@pytest.mark.asyncio
async def test_xsd_file_repository(dummy_xsd_file_resource_in_1: XSDFileResourceIn,
                                   dummy_xsd_file_resource_in_2: XSDFileResourceIn,
                                   dummy_xsd_file_resource_in_3: XSDFileResourceIn,
                                   dummy_project_id: PydanticObjectId):
    xsd_file_repo = XSDFileResourceBeanieRepository()
    dummy_xsd_file_1: XSDFileResource = XSDFileResource(**dummy_xsd_file_resource_in_1.dict())
    dummy_xsd_file_2: XSDFileResource = XSDFileResource(**dummy_xsd_file_resource_in_2.dict())
    dummy_xsd_file_3: XSDFileResource = XSDFileResource(**dummy_xsd_file_resource_in_3.dict())

    with pytest.raises(NotImplementedError):
        await xsd_file_repo.update(dummy_xsd_file_1)

    with pytest.raises(ProjectNotFoundException):
        await xsd_file_repo.get_all(dummy_project_id)

    with pytest.raises(ProjectNotFoundException):
        await xsd_file_repo.get_by_id(dummy_project_id, dummy_xsd_file_resource_in_1.filename)

    with pytest.raises(ProjectNotFoundException):
        await xsd_file_repo.create(dummy_project_id, dummy_xsd_file_1)

    with pytest.raises(ProjectNotFoundException):
        await xsd_file_repo.delete(dummy_project_id, dummy_xsd_file_resource_in_1.filename)

    new_project = await create_project(ProjectCreateIn(title="dummy_project_name"), None)

    assert len(await xsd_file_repo.get_all(new_project.id)) == 0

    with pytest.raises(XSDFileResourceNotFoundException):
        await xsd_file_repo.get_by_id(new_project.id, dummy_xsd_file_resource_in_1.filename)

    with pytest.raises(XSDFileResourceNotFoundException):
        await xsd_file_repo.delete(new_project.id, dummy_xsd_file_1.filename)


    await xsd_file_repo.create(new_project.id, dummy_xsd_file_1)
    with pytest.raises(XSDFileResourceExistsException):
        await xsd_file_repo.create(new_project.id, dummy_xsd_file_1)

    assert len(await xsd_file_repo.get_all(new_project.id)) == 1
    await xsd_file_repo.create(new_project.id, dummy_xsd_file_2)
    await xsd_file_repo.create(new_project.id, dummy_xsd_file_3)
    assert len(await xsd_file_repo.get_all(new_project.id)) == 3

    await xsd_file_repo.delete(new_project.id, dummy_xsd_file_1.filename)
    assert len(await xsd_file_repo.get_all(new_project.id)) == 2