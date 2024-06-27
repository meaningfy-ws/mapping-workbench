import io
import pathlib
import tempfile
import zipfile

from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.adapters.eforms.importer import EFormsPackageImporter
from mapping_workbench.backend.package_importer.adapters.importer_abc import PackageImporterABC
from mapping_workbench.backend.package_importer.adapters.importer_factory import PackageImporterFactory
from mapping_workbench.backend.package_importer.adapters.standard.importer import StandardPackageImporter
from mapping_workbench.backend.package_importer.services.import_mono_eforms_mapping_suite import \
    import_mapping_suite_from_file_system
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


async def import_mapping_package(
        mapping_package_dir_path: pathlib.Path, project: Project,
        package_type: PackageType, user: User = None
) -> MappingPackage:
    monolith_mapping_suite = import_mapping_suite_from_file_system(
        mapping_package_dir_path
    )

    importer: PackageImporterABC = PackageImporterFactory.get_importer(
        package_type=package_type, project=project, user=user
    )
    package: MappingPackage = await importer.import_from_mono_mapping_suite(monolith_mapping_suite)
    return package


async def import_mapping_package_from_archive(
        file_content: bytes, project: Project, package_type: PackageType, user: User = None
) -> MappingPackage:
    zf = zipfile.ZipFile(io.BytesIO(file_content))
    tempdir = tempfile.TemporaryDirectory()
    tempdir_name = tempdir.name
    tempdir_path = pathlib.Path(tempdir_name)
    zf.extractall(tempdir_name)
    dir_contents = list(tempdir_path.iterdir())
    assert len(dir_contents) == 1

    return await import_mapping_package(dir_contents[0], project, package_type, user)


async def clear_project_data(project: Project, package_type: PackageType = None):
    if package_type == PackageType.EFORMS:
        return await EFormsPackageImporter.clear_project_data(project)
    elif package_type == PackageType.STANDARD:
        return await StandardPackageImporter.clear_project_data(project)
    return None
