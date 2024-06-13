import pytest
from beanie import PydanticObjectId

from mapping_workbench.backend.ontology_suite.adapters.ontology_file_beanie_repository import \
    OntologyFileResourceBeanieRepository, OntologyFileResourceNotFoundException, OntologyFileResourceExistsException
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResourceIn, \
    OntologyFileResource
from mapping_workbench.backend.project.models.entity import ProjectNotFoundException, ProjectCreateIn
from mapping_workbench.backend.project.services.api import create_project


@pytest.mark.asyncio
async def test_xsd_file_repository(dummy_epo_ontology: OntologyFileResourceIn,
                                   dummy_project_id: PydanticObjectId):
    ontology_file_repo = OntologyFileResourceBeanieRepository()
    epo_ontology_file: OntologyFileResource = OntologyFileResource(**dummy_epo_ontology.dict())

    with pytest.raises(NotImplementedError):
        await ontology_file_repo.update(epo_ontology_file)

    with pytest.raises(ProjectNotFoundException):
        await ontology_file_repo.get_all(dummy_project_id)

    with pytest.raises(ProjectNotFoundException):
        await ontology_file_repo.get_by_id(dummy_project_id, epo_ontology_file.filename)

    with pytest.raises(ProjectNotFoundException):
        await ontology_file_repo.create(dummy_project_id, epo_ontology_file)

    with pytest.raises(ProjectNotFoundException):
        await ontology_file_repo.delete(dummy_project_id, epo_ontology_file.filename)

    new_project = await create_project(ProjectCreateIn(title="dummy_project_name"), None)

    assert len(await ontology_file_repo.get_all(new_project.id)) == 0

    with pytest.raises(OntologyFileResourceNotFoundException):
        await ontology_file_repo.get_by_id(new_project.id, epo_ontology_file.filename)

    with pytest.raises(OntologyFileResourceNotFoundException):
        await ontology_file_repo.delete(new_project.id, epo_ontology_file.filename)

    await ontology_file_repo.create(new_project.id, epo_ontology_file)
    with pytest.raises(OntologyFileResourceExistsException):
        await ontology_file_repo.create(new_project.id, epo_ontology_file)

    assert len(await ontology_file_repo.get_all(new_project.id)) == 1

    await ontology_file_repo.delete(new_project.id, epo_ontology_file.filename)
    assert len(await ontology_file_repo.get_all(new_project.id)) == 0
