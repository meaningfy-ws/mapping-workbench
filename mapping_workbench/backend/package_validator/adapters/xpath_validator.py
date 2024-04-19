import io
from typing import List, Any
from xml.etree import ElementTree

from pydantic import validate_call
from saxonche import PySaxonProcessor, PySaxonApiError, PyXPathProcessor

from mapping_workbench.backend.package_validator.adapters.data_validator import TestDataValidator
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertionEntry


class XPATHValidator(TestDataValidator):
    """
    """

    xp: Any = None

    @validate_call
    def __init__(self, xml_content, **data: Any):
        super().__init__(**data)
        self.xp = self.init_xp_processor(xml_content)

    def validate(self, xpath_expression) -> List[XPathAssertionEntry]:
        return self.get_unique_xpaths(xpath_expression)

    @classmethod
    def extract_namespaces(cls, xml_content):
        xml_file = io.StringIO(xml_content)
        namespaces = dict()
        for event, elem in ElementTree.iterparse(xml_file, events=('start-ns',)):
            ns, url = elem
            namespaces[ns] = url
        return namespaces

    @classmethod
    def init_xp_processor(cls, xml_content: str) -> PyXPathProcessor:
        namespaces = cls.extract_namespaces(xml_content)
        proc = PySaxonProcessor(license=False)
        xp = proc.new_xpath_processor()
        for prefix, ns_uri in namespaces.items():
            xp.declare_namespace(prefix, ns_uri)
        document = proc.parse_xml(xml_text=xml_content)
        xp.set_context(xdm_item=document)

        return xp

    def check_xpath_expression(self, xpath_expression: str) -> bool:
        try:
            items = self.xp.evaluate(xpath_expression)
            return True if items.size > 0 else False
        except PySaxonApiError:
            return False

    def get_unique_xpaths(self, xpath_expression) -> List[XPathAssertionEntry]:
        """Get unique XPaths that cover elements matching e XPath expression."""

        unique_xpaths = set()
        xpaths = []

        if xpath_expression not in unique_xpaths and self.check_xpath_expression(xpath_expression):
            unique_xpaths.add(xpath_expression)

            xpaths.append(XPathAssertionEntry(
                xpath=xpath_expression,
                value=None
            ))

        return xpaths
