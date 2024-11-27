from mapping_workbench.backend.project.adapters.source_files_exporter import SourceFilesExporter
from mapping_workbench.backend.project.models.entity import Project


async def export_source_files(project: Project) -> bytes:
    """

    :param project:
    :return:
    """

    exporter: SourceFilesExporter = SourceFilesExporter(
        project=project
    )

    return await exporter.export()