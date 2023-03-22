import os
import shutil
from pathlib import Path

import click
from ted_sws.core.adapters.cmd_runner import CmdRunner as BaseCmdRunner, DEFAULT_MAPPINGS_PATH
from ted_sws.data_manager.adapters.mapping_suite_repository import MS_SPARQL_FOLDER_NAME, MS_VALIDATE_FOLDER_NAME
from ted_sws.mapping_suite_processor.services.conceptual_mapping_files_injection import \
    mapping_suite_processor_inject_integration_sparql_queries as inject_integration_sparql_queries

from mapping_workbench.workbench_tools.mapping_suite_processor.entrypoints.cli import CONCEPTUAL_MAPPINGS_FILE_TEMPLATE

DEFAULT_OUTPUT_SPARQL_QUERIES_FOLDER = '{mappings_path}/{mapping_suite_id}/' + MS_VALIDATE_FOLDER_NAME + '/' + \
                                       MS_SPARQL_FOLDER_NAME + '/integration_tests'
SRC_SPARQL_QUERIES_PATH = Path("src/validation/sparql")
CMD_NAME = "CMD_SPARQL_QUERIES_INJECTOR"

"""
USAGE:
# sparql_queries_injector --help
"""


class CmdRunner(BaseCmdRunner):
    """
    Keeps the logic to be used by SPARQL Queries Injector CMD
    """

    def __init__(
            self,
            conceptual_mappings_file,
            sparql_queries_folder,
            output_folder
    ):
        super().__init__(name=CMD_NAME)
        self.conceptual_mappings_file_path = Path(os.path.realpath(conceptual_mappings_file))
        self.sparql_queries_folder_path = Path(os.path.realpath(sparql_queries_folder))
        self.output_folder_path = Path(os.path.realpath(output_folder))

    def run_cmd(self):
        error = None
        try:
            shutil.rmtree(self.output_folder_path, ignore_errors=True)
            self.output_folder_path.mkdir(parents=True, exist_ok=True)
            inject_integration_sparql_queries(
                conceptual_mappings_file_path=self.conceptual_mappings_file_path,
                sparql_queries_folder_path=self.sparql_queries_folder_path,
                output_sparql_queries_folder_path=self.output_folder_path
            )
        except Exception as e:
            error = e

        return self.run_cmd_result(error)


def run(mapping_suite_id=None,
        opt_conceptual_mappings_file: str = None,
        opt_output_folder: str = None,
        opt_sparql_queries_folder: str = str(SRC_SPARQL_QUERIES_PATH),
        opt_mappings_folder=DEFAULT_MAPPINGS_PATH
        ):
    """
    This method will inject the SPARQL queries into the MappingSuite
    :param mapping_suite_id:
    :param opt_conceptual_mappings_file:
    :param opt_output_folder:
    :param opt_sparql_queries_folder:
    :param opt_mappings_folder:
    :return:
    """
    if opt_conceptual_mappings_file:
        conceptual_mappings_file = opt_conceptual_mappings_file
    else:
        conceptual_mappings_file = CONCEPTUAL_MAPPINGS_FILE_TEMPLATE.format(
            mappings_path=opt_mappings_folder,
            mapping_suite_id=mapping_suite_id
        )

    sparql_queries_folder = opt_sparql_queries_folder

    if opt_output_folder and not mapping_suite_id:
        output_folder = opt_output_folder
    else:
        output_folder = DEFAULT_OUTPUT_SPARQL_QUERIES_FOLDER.format(
            mappings_path=opt_mappings_folder,
            mapping_suite_id=mapping_suite_id
        )

    cmd = CmdRunner(
        conceptual_mappings_file=conceptual_mappings_file,
        sparql_queries_folder=sparql_queries_folder,
        output_folder=output_folder
    )
    cmd.run()


@click.command()
@click.argument('mapping-suite-id', nargs=1, required=False)
@click.option('-i', '--opt-conceptual-mappings-file', help="Use to overwrite default INPUT")
@click.option('-o', '--opt-output-folder', help="Use to overwrite default OUTPUT")
@click.option('-sq', '--opt-sparql-queries-folder', default=str(SRC_SPARQL_QUERIES_PATH))
@click.option('-m', '--opt-mappings-folder', default=DEFAULT_MAPPINGS_PATH)
def main(mapping_suite_id, opt_conceptual_mappings_file, opt_output_folder, opt_sparql_queries_folder,
         opt_mappings_folder):
    """
    Injects the SPARQL Queries from Conceptual Mappings into the MappingSuite.
    """
    run(mapping_suite_id, opt_conceptual_mappings_file, opt_output_folder, opt_sparql_queries_folder,
        opt_mappings_folder)


if __name__ == '__main__':
    main()
