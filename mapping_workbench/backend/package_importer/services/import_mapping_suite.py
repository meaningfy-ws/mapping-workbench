import io
import pathlib
import tempfile
import zipfile

from mapping_workbench.backend.core.services.exceptions import InvalidResourceException
from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.mapping_package.models.entity import MappingPackage
from mapping_workbench.backend.package_importer.adapters.eforms.importer import EFormsPackageImporter
from mapping_workbench.backend.package_importer.adapters.importer_abc import PackageImporterABC
from mapping_workbench.backend.package_importer.adapters.importer_factory import PackageImporterFactory
from mapping_workbench.backend.package_importer.adapters.standard.importer import StandardPackageImporter
from mapping_workbench.backend.package_importer.models.imported_mapping_suite import ImportedMappingSuiteResponse
from mapping_workbench.backend.package_importer.services.import_mono_eforms_mapping_suite import \
    import_eforms_mapping_suite_from_file_system
from mapping_workbench.backend.package_importer.services.import_mono_standard_mapping_suite import \
    import_standard_mapping_suite_from_file_system
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.tasks.models.task_response import TaskResponse
from mapping_workbench.backend.user.models.user import User


async def import_mapping_package(
        mapping_package_dir_path: pathlib.Path, project: Project,
        package_type: PackageType, user: User = None
) -> ImportedMappingSuiteResponse:
    if package_type == PackageType.STANDARD:
        monolith_mapping_suite = import_standard_mapping_suite_from_file_system(mapping_package_dir_path)
    else:  # package_type == PackageType.EFORMS:
        monolith_mapping_suite = import_eforms_mapping_suite_from_file_system(mapping_package_dir_path)

    importer: PackageImporterABC = PackageImporterFactory.get_importer(
        package_type=package_type, project=project, user=user
    )
    package: MappingPackage = await importer.import_from_mono_mapping_suite(monolith_mapping_suite)

    return ImportedMappingSuiteResponse(
        mapping_package=package,
        warnings=importer.warnings
    )


async def import_mapping_package_from_archive(
        file_content: bytes, project: Project, package_type: PackageType, user: User = None,
        task_response: TaskResponse = None
) -> ImportedMappingSuiteResponse:
    zf = zipfile.ZipFile(io.BytesIO(file_content))
    tempdir = tempfile.TemporaryDirectory()
    tempdir_name = tempdir.name
    tempdir_path = pathlib.Path(tempdir_name)
    zf.extractall(tempdir_name)
    dir_contents = list(tempdir_path.iterdir())
    try:
        assert len(dir_contents) == 1, "Archive must contain only the package folder!"
    except AssertionError as error:
        raise InvalidResourceException(str(error))

    result = await import_mapping_package(dir_contents[0], project, package_type, user)
    if task_response:
        task_response.data = result
    return result


async def clear_project_data(project: Project, package_type: PackageType = None):
    if package_type == PackageType.EFORMS:
        return await EFormsPackageImporter.clear_project_data(project)
    elif package_type == PackageType.STANDARD:
        return await StandardPackageImporter.clear_project_data(project)
