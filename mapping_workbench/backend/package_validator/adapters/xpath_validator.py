import io
import re
from typing import List, Any, Union
from xml.etree import ElementTree

from pydantic import validate_call
from saxonche import PySaxonProcessor, PySaxonApiError, PyXPathProcessor, PyXdmNode, PyXdmValue, XdmNodeKind, \
    PyXQueryProcessor

from mapping_workbench.backend.logger.services import mwb_logger
from mapping_workbench.backend.package_validator.adapters.data_validator import TestDataValidator
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertionEntry


class XPATHValidator(TestDataValidator):
    """
    """

    xp: Any = None # saxon_processor
    xpp: Any = None # xpath_processor
    xqp: Any = None # xquery_processor
    namespaces: Any = None
    prefixes: Any = None
    DEFAULT_XML_NS_PREFIX: str = ''

    @validate_call
    def __init__(self, xml_content, **data: Any):
        super().__init__(**data)
        self.namespaces = self.extract_namespaces(xml_content)
        self.prefixes = {v: k for k, v in self.namespaces.items()}
        self.xp = PySaxonProcessor(license=False)
        self.init_xp_processors(xml_content)

    def validate(self, xpath_expression) -> List[XPathAssertionEntry]:
        return self.get_unique_xpaths(xpath_expression)

    def check_xpath_condition(self, xquery_expression) -> bool:
        if not xquery_expression:
            return True

        try:
            self.xqp.set_query_content(xquery_expression)
            result: PyXdmValue = self.xqp.run_query_to_value()
            return str(result) == 'true'
        except PySaxonApiError as e:
            mwb_logger.log_all_error(str(e), str(e))
            return False

    def get_ns_tag(self, node: PyXdmNode) -> Union[str, None]:
        if node is None or node.name is None:
            return None
        xpath = node.local_name
        match = re.match(r"Q{(.*)}(.*)", node.name)

        if match:
            ns = match.group(1)
            tag = match.group(2)
            prefix = self.prefixes[ns]
            return f"{prefix}:{tag}" if prefix else tag

        return xpath

    def get_node_xpath(self, node: PyXdmNode) -> Union[str, None]:
        """Recursively get XPath for each element in the tree."""
        xpath = self.get_ns_tag(node)
        if xpath is None:
            return None
        path_parts = [xpath]
        parent = node.get_parent()
        while parent and isinstance(parent, PyXdmNode) and parent.name:
            xpath = self.get_ns_tag(parent)
            if xpath is not None:
                path_parts.insert(0, xpath)
            parent = parent.get_parent()

        return '/'.join(path_parts)

    @classmethod
    def get_node_text_value(cls, node: PyXdmNode) -> Union[str, None]:
        if (
                node.node_kind == XdmNodeKind.ATTRIBUTE
                or len(node.children) == 1
        ):
            return node.get_string_value()
        return None

    def extract_namespaces(self, xml_content):
        xml_file = io.StringIO(xml_content)
        namespaces = dict()
        for event, elem in ElementTree.iterparse(xml_file, events=('start-ns',)):
            ns, url = elem
            if ns == '':
                ns = self.DEFAULT_XML_NS_PREFIX
            namespaces[ns] = url
        return namespaces

    def init_xp_processors(self, xml_content: str):

        self.xpp: PyXPathProcessor = self.xp.new_xpath_processor()
        self.xqp: PyXQueryProcessor = self.xp.new_xquery_processor()

        for prefix, ns_uri in self.namespaces.items():
            self.xpp.declare_namespace(prefix, ns_uri)
            self.xqp.declare_namespace(prefix, ns_uri)

        document = self.xp.parse_xml(xml_text=xml_content)
        self.xpp.set_context(xdm_item=document)
        self.xqp.set_context(xdm_item=document)

    def check_xpath_expression(self, xpath_expression: str) -> Union[PyXdmValue, None]:
        try:
            return self.xpp.evaluate(xpath_expression)
        except PySaxonApiError | Exception as e:
            mwb_logger.log_all_error(str(e), str(e))
            return None

    def get_unique_xpaths(self, xpath_expression) -> List[XPathAssertionEntry]:
        """Get unique XPaths that cover elements matching e XPath expression."""
        xpath_assertions = []
        matching_elements = self.check_xpath_expression(xpath_expression)
        if matching_elements and matching_elements.size > 0:
            for element in matching_elements:
                xpath_node: PyXdmNode = element.get_node_value()

                xpath = self.get_node_xpath(xpath_node)
                if xpath:
                    xpath_assertions.append(XPathAssertionEntry(
                        xpath=xpath,
                        value=self.get_node_text_value(xpath_node)
                    ))

        return xpath_assertions
