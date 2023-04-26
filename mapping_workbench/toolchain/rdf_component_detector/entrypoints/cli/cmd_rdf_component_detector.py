from pathlib import Path

import click
from ted_sws.core.adapters.cmd_runner import CmdRunner as BaseCmdRunner
from ted_sws.core.adapters.cmd_runner import DEFAULT_OUTPUT_PATH
from mapping_workbench.toolchain.rdf_component_detector.services.detect_graph_component import \
    detect_graph_components

CMD_NAME = "CMD_RDF_COMPONENT_DETECTOR"

"""
USAGE:
# component_detector --help
"""


class CmdRunner(BaseCmdRunner):

    def __init__(self, package_name: str):
        super().__init__(name=CMD_NAME)
        self.package_name: Path = Path(package_name)

    def run_cmd(self):
        self.log(f"Running RDF Component detector for {self.package_name.name}")
        error = None
        try:
            rdf_files_paths = list((self.package_name / DEFAULT_OUTPUT_PATH).rglob("*.ttl"))
            for rdf_file_path in rdf_files_paths:
                self.log(f"Detecting components for {rdf_file_path.name}")
                detect_graph_components(rdf_file_path)
                self.log(f"Detecting components for {rdf_file_path.name} done")
        except Exception as e:
            error = e
        return self.run_cmd_result(error)


@click.command()
@click.argument('package-name', required=True)
def main(package_name):
    """
    Given RDF file, detects number of components in graph.
    :param package_name: Path to package folder.
    """
    cmd = CmdRunner(
        package_name=package_name,
    )
    cmd.run()


if __name__ == '__main__':
    main()
