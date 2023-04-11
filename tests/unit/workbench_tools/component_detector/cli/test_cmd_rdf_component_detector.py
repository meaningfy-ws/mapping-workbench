from mapping_workbench.workbench_tools.rdf_component_detector.entrypoints.cli.cmd_rdf_component_detector import \
    main as cli_main


def test_cmd_rdf_component_detector(cli_runner, test_package_folder):
    #cli_runner.invoke(cli_main, test_package_folder.name)
    cli_main([str(test_package_folder)], standalone_mode=False)
