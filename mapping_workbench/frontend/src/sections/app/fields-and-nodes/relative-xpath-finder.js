import {useEffect} from "react";
import {FormTextField} from "../../../components/app/form/text-field";
import {addNsPrefix, extractNamespaces} from "./utils";

const RelativeXPath = ({xmlContent, xpath, absolute_xpath, formik}) => {

    useEffect(() => {
        if (!!xmlContent && xpath && absolute_xpath)
            evaluateXPAthExpression(xpath, absolute_xpath, xmlContent)
    }, [xmlContent, xpath, absolute_xpath]);


// Function to get the relative XPath of a node from a given context node
    const getRelativeXPath = (node, contextNode) => {
        const parts = [];
        while (node && node !== contextNode) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const nodeName = node.nodeName;
                console.log(nodeName)
                parts.unshift(nodeName);
            }
            node = node.parentNode;
        }
        console.log(parts.join('/'))
        return parts.join('/');
    }

// Evaluate the XPath expression and find the nodes
//     const xpathExpr = '/*/cac:BusinessParty/cac:PostalAddress/cbc:PostalZone';
//     const contextNodeExpr = '/*/cac:BusinessParty/cac:PostalAddress';

    const evaluateXPAthExpression = (contextNodeExpr, xpathExpr, xmlDoc) => {

        // Extract namespaces from the XML
        const namespaces = extractNamespaces(xmlDoc);

        // Function to resolve namespaces in XPath expressions
        const nsResolver = (prefix) => namespaces[prefix] || namespaces[""] || null;

        try {
            const contextResult = xmlDoc.evaluate(addNsPrefix(contextNodeExpr), xmlDoc, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const contextNode = contextResult.singleNodeValue;
            if (contextNode) {
                const result = xmlDoc.evaluate(addNsPrefix(xpathExpr), xmlDoc, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                if (result.snapshotLength > 0) {
                    for (let i = 0; i < result.snapshotLength; i++) {
                        const node = result.snapshotItem(i);
                        const relativeXPath = getRelativeXPath(node, contextNode);
                        if (relativeXPath) {
                            formik.setFieldValue('relative_xpath', relativeXPath)
                            break;
                        }
                    }
                } else {
                    formik.setErrors({relative_xpath: 'No nodes found.'})
                }
            } else {
                formik.setErrors({relative_xpath: 'Context node not found.'})
            }
        } catch (err) {
            formik.setErrors({relative_xpath: 'Unable to process xpath.'})
        }
    }

    return (
        <FormTextField
            disabled
            label='Relative XPath'
            name="relative_xpath"
            formik={formik}
        />
    )

}

export default RelativeXPath