import pathlib

RESOURCES_PATH = pathlib.Path(__file__).parent.resolve()

SHACL_TEMPLATES_PATH = RESOURCES_PATH / "templates"

SHACL_SHAPES_PATH = RESOURCES_PATH / 'shacl_shapes'
SHACL_RESULT_QUERY_PATH = SHACL_SHAPES_PATH / 'shacl_result_query.rq'

SHACL_TEST_SUITE_EXECUTION_HTML_REPORT_TEMPLATE = "shacl_shape_validation_results_report.jinja2"