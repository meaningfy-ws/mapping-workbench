from mapping_workbench.backend.mapping_package import PackageType
from mapping_workbench.backend.package_importer.adapters.eforms.importer import EFormsPackageImporter
from mapping_workbench.backend.package_importer.adapters.importer_abc import PackageImporterABC
from mapping_workbench.backend.package_importer.adapters.standard.importer import StandardPackageImporter
from mapping_workbench.backend.project.models.entity import Project
from mapping_workbench.backend.user.models.user import User


class PackageImporterFactory:
    @classmethod
    def get_importer(cls, package_type: PackageType, project: Project, user: User) -> PackageImporterABC:
        if package_type == PackageType.STANDARD:
            return StandardPackageImporter(project=project, user=user)
        else:  # package_type == PackageType.EFORMS:
            return EFormsPackageImporter(project=project, user=user)
