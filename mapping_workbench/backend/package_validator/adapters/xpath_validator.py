from typing import List, Any

from lxml import etree
from pydantic import validate_call

from mapping_workbench.backend.package_validator.adapters.data_validator import TestDataValidator
from mapping_workbench.backend.package_validator.models.xpath_validation import XPathAssertionEntry


class XPATHValidator(TestDataValidator):
    """
    """

    xml_content: Any = None
    DEFAULT_XML_NS_PREFIX: str = 'ns'

    @validate_call
    def __init__(self, xml_content, **data: Any):
        super().__init__(**data)
        self.xml_content = xml_content

    def validate(self, xpath_expression) -> List[XPathAssertionEntry]:
        xpaths = self.get_unique_xpaths(self.xml_content, xpath_expression)
        return xpaths

    @classmethod
    def get_ns_tag(cls, node):
        if hasattr(node, 'prefix'):
            prefix = ""
            if node.prefix is not None:
                prefix = f"{node.prefix}:"
            return f"{prefix}{node.tag[len('{' + node.nsmap[node.prefix] + '}'):]}" \
                if node.prefix in node.nsmap else node.tag
        else:
            return node

    def get_element_xpath(self, element) -> str:
        """Recursively get XPath for each element in the tree."""
        path = [self.get_ns_tag(element)]
        parent = element.getparent()
        while parent is not None:
            path.insert(0, self.get_ns_tag(parent))
            parent = parent.getparent()
        return '/'.join(path)

    def get_unique_xpaths(self, xml_content, xpath_expression) -> List[XPathAssertionEntry]:
        unique_xpaths = set()
        xpaths = []

        """Get unique XPaths that cover elements matching the XPath expression."""
        root = etree.fromstring(bytes(xml_content, encoding="utf-8"))

        namespaces = root.nsmap
        if None in namespaces:
            namespaces[self.DEFAULT_XML_NS_PREFIX] = namespaces.pop(None)

        matching_elements = root.xpath(xpath_expression, namespaces=namespaces)
        for element in matching_elements:
            xpath = self.get_element_xpath(element)

            if xpath not in unique_xpaths:
                unique_xpaths.add(xpath)
                value = None
                if hasattr(element, 'text'):
                    value = element.text
                xpaths.append(XPathAssertionEntry(
                    xpath=xpath,
                    value=value
                ))

        return xpaths
