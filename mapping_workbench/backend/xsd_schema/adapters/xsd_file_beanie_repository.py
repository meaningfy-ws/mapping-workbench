from typing import List

from beanie import PydanticObjectId

from mapping_workbench.backend.core.models.abc import IRepository
from mapping_workbench.backend.project.services.api import get_project_link
from mapping_workbench.backend.xsd_schema.models.xsd_file_resource import XSDFileResource


class XSDFileResourceExistsException(Exception):
    pass


class XSDFileResourceNotFoundException(Exception):
    pass


class XSDFileResourceBeanieRepository(IRepository):

    async def get_all(self, project_id: PydanticObjectId) -> List[XSDFileResource]:
        project_link = await get_project_link(project_id)
        return await XSDFileResource.find_many(
            XSDFileResource.project == project_link
        ).to_list()

    async def get_by_id(self,
                        project_id: PydanticObjectId,
                        xsd_file_name: str) -> XSDFileResource:
        project_link = await get_project_link(project_id)

        xsd_file: XSDFileResource = await XSDFileResource.find_one(
            XSDFileResource.filename == xsd_file_name,
            XSDFileResource.project == project_link
        )
        if not xsd_file:
            raise XSDFileResourceNotFoundException(f"XSD File {xsd_file_name} doesn't exist in project {project_id}")

        return xsd_file

    async def create(self,
                     project_id: PydanticObjectId,
                     xsd_file: XSDFileResource) -> None:
        project_link = await get_project_link(project_id)

        if await XSDFileResource.find_one(
                XSDFileResource.project == project_link,
                XSDFileResource.filename == xsd_file.filename,
        ).count() == 1:
            raise XSDFileResourceExistsException(f"XSD File {xsd_file.filename} already exists")

        xsd_file.project = project_link
        # TODO: Temporary user=None
        await xsd_file.on_create(user=None).create()
        return None

    async def delete(self,
                     project_id: PydanticObjectId,
                     xsd_file_name: str) -> None:
        xsd_file: XSDFileResource = await self.get_by_id(project_id, xsd_file_name)

        await xsd_file.delete()
        return None

    async def update(self, xsd_file: XSDFileResource) -> NotImplemented:
        raise NotImplementedError("XSD Files are read-only")
