#!/usr/bin/python3

import click

from ted_sws.core.adapters.cmd_runner import CmdRunner as BaseCmdRunner

from mapping_workbench.workbench_tools.shacl_summary.services.shacl_summary_generator import generate_shacl_summary

CMD_NAME = "Example_CMD"


class CmdRunner(BaseCmdRunner):
    """
    Keeps the logic to be used by RML Runner
    """

    def __init__(
            self,
            some_text: str
    ):
        super().__init__(name=CMD_NAME)
        self.some_text = some_text

    def run_cmd(self):
        error = None
        try:
            generate_shacl_summary(some_text=self.some_text)
        except Exception as e:
            error = e

        return self.run_cmd_result(error)


def run(some_text: str):
    cmd = CmdRunner(some_text=some_text)
    cmd.run()


@click.command()
@click.argument('some_text', nargs=1, required=True)
def main(some_text):
    """
    Generates RML modules report file for Mapping Suite.
    """
    run(some_text=some_text)


if __name__ == '__main__':
    main()
