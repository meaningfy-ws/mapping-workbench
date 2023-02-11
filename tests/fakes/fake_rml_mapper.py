import pathlib

from mapping_workbench.notice_transformer.adapters.rml_mapper import RMLMapperABC, SerializationFormat


class FakeRMLMapper(RMLMapperABC):
    def execute(self, package_path: pathlib.Path) -> str:
        return "RDF result"
