import pathlib

RESOURCES_PATH = pathlib.Path(__file__).parent.resolve()

SPARQL_TEMPLATES_PATH = RESOURCES_PATH / "templates"
SPARQL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE = "sparql_query_results_report.jinja2"