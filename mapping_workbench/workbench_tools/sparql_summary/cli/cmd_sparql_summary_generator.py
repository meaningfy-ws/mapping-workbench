#!/usr/bin/python3
import pathlib

import click

from ted_sws.core.adapters.cmd_runner import CmdRunner as BaseCmdRunner

from mapping_workbench.workbench_tools.sparql_summary.services.sparql_summary_generator import generate_sparql_summary

CMD_NAME = "SPARQL_SUMMARY_CMD"


class CmdRunner(BaseCmdRunner):
    """
    Keeps the logic to be used by RML Runner
    """

    def __init__(
            self,
            packages_dir_path: pathlib.Path
    ):
        super().__init__(name=CMD_NAME)
        self.packages_dir_path = packages_dir_path

    def run_cmd(self):
        error = None
        try:
            generate_sparql_summary(packages_dir_path=self.packages_dir_path)
        except Exception as e:
            error = e

        return self.run_cmd_result(error)


def run(packages_dir_path: str):
    cmd = CmdRunner(packages_dir_path=pathlib.Path(packages_dir_path))
    cmd.run()


@click.command()
@click.argument('packages_dir_path', nargs=1, required=True)
def main(packages_dir_path):

    """
    Generates RML modules report file for Mapping Suite.
    """
    run(packages_dir_path=packages_dir_path)


if __name__ == '__main__':
    main()
