import io
import zipfile
from pathlib import Path

from mapping_workbench.backend.mapping_package.adapters.importer import PackageImporter
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


async def import_package(file_content: bytes, file_name: str, project: Project, user: User):
    zf = zipfile.ZipFile(io.BytesIO(file_content))
    importer: PackageImporter = PackageImporter(Path(file_name).stem, zf, project, user)
    await importer.run()
