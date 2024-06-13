from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.abc import IRepository
from mapping_workbench.backend.ontology_suite.models.ontology_file_resource import OntologyFileResource
from mapping_workbench.backend.project.services.api import get_project_link


class OntologyFileResourceExistsException(Exception):
    pass


class OntologyFileResourceNotFoundException(Exception):
    pass


class OntologyFileResourceBeanieRepository(IRepository):

    async def get_all(self, project_id: PydanticObjectId) -> List[OntologyFileResource]:
        project_link = await get_project_link(project_id)
        return await OntologyFileResource.find_many(
            OntologyFileResource.project == project_link
        ).to_list()

    async def get_by_id(self,
                        project_id: PydanticObjectId,
                        ontology_file_name: str) -> OntologyFileResource:
        project_link = await get_project_link(project_id)

        ontology_file: OntologyFileResource = await OntologyFileResource.find_one(
            OntologyFileResource.filename == ontology_file_name,
            OntologyFileResource.project == project_link
        )
        if not ontology_file:
            raise OntologyFileResourceNotFoundException(
                f"Ontology File {ontology_file_name} doesn't exist in project {project_id}")

        return ontology_file

    async def create(self,
                     project_id: PydanticObjectId,
                     ontology_file: OntologyFileResource) -> None:
        project_link = await get_project_link(project_id)

        if await OntologyFileResource.find_one(
                OntologyFileResource.project == project_link,
                OntologyFileResource.filename == ontology_file.filename,
        ).count() == 1:
            raise OntologyFileResourceExistsException(f"Ontology File {ontology_file.filename} already exists")

        ontology_file.project = project_link
        # TODO: Temporary user=None
        await ontology_file.on_create(user=None).create()
        return None

    async def delete(self,
                     project_id: PydanticObjectId,
                     ontology_file_name: str) -> None:
        ontology_file: OntologyFileResource = await self.get_by_id(project_id, ontology_file_name)

        await ontology_file.delete()
        return None

    async def update(self, ontology_file: OntologyFileResource) -> NotImplemented:
        raise NotImplementedError("Ontology Files are read-only")
