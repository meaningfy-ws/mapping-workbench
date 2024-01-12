import io
import zipfile
from pathlib import Path

from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.adapters.importer import PackageImporter
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


async def import_package(file_content: bytes, file_name: str, project: Project, user: User) -> MappingPackage:
    zf = zipfile.ZipFile(io.BytesIO(file_content))
    importer: PackageImporter = PackageImporter(Path(file_name).stem, zf, project, user)
    return await importer.run()


async def clear_project_data(project: Project):
    return await PackageImporter.clear_project_data(project)
