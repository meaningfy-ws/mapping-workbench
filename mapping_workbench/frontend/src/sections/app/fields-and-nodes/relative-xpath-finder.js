import {FormTextField} from "../../../components/app/form/text-field";
import {useEffect} from "react";

const RelativeXPath = ({xmlContent, xpath, absolute_xpath, formik}) => {

    useEffect(() => {
        console.log(`"${xmlContent}"`)
        if (!!xmlContent && xpath && absolute_xpath)
            evaluateXPAthExpression(xpath, getGlobalXPath(absolute_xpath), xmlContent)
    }, [xmlContent, xpath, absolute_xpath]);

    const getGlobalXPath = (xpath) => {
        const xp = xpath.split('/')
        xp.shift()
        return '/*/' + xp.join('/')
    }

// Function to extract namespaces from the root element
    const extractNamespaces = (doc) => {
        const root = doc.documentElement;
        const attributes = root.attributes;
        const namespaces = {};

        for (let i = 0; i < attributes.length; i++) {
            const attr = attributes[i];
            if (attr.name.startsWith('xmlns:')) {
                const prefix = attr.name.split(':')[1];
                namespaces[prefix] = attr.value;
            }
        }

        return namespaces;
    }


// Function to get the relative XPath of a node from a given context node
    function getRelativeXPath(node, contextNode) {
        const parts = [];
        while (node && node !== contextNode) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const nodeName = node.nodeName;
                parts.unshift(nodeName);
            }
            node = node.parentNode;
        }
        return parts.join('/');
    }

// Evaluate the XPath expression and find the nodes
//     const xpathExpr = '/*/cac:BusinessParty/cac:PostalAddress/cbc:PostalZone';
//     const contextNodeExpr = '/*/cac:BusinessParty/cac:PostalAddress';

    const evaluateXPAthExpression = (contextNodeExpr, xpathExpr, xmlDoc) => {

        // Extract namespaces from the XML
        const namespaces = extractNamespaces(xmlDoc);

        // Function to resolve namespaces in XPath expressions
        const nsResolver = (prefix) => {
            return namespaces[prefix] || null;
        }

        try {

            const contextResult = xmlDoc.evaluate(contextNodeExpr, xmlDoc, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const contextNode = contextResult.singleNodeValue;
            if (contextNode) {
                const result = xmlDoc.evaluate(xpathExpr, xmlDoc, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                if (result.snapshotLength > 0) {
                    for (let i = 0; i < result.snapshotLength; i++) {
                        const node = result.snapshotItem(i);
                        const relativeXPath = getRelativeXPath(node, contextNode);
                        // console.log(`Node found: ${node.textContent}`);
                        // console.log(`Relative XPath: ${relativeXPath}`);
                        formik.setFieldValue('relative_xpath', relativeXPath)

                    }
                } else {
                    formik.setErrors({relative_xpath: 'No nodes found.'})
                    // console.log('No nodes found.');
                }
            } else {
                formik.setErrors({relative_xpath: 'Context node not found.'})
                // console.log('Context node not found.');
            }
        } catch (err) {
            formik.setErrors({relative_xpath: 'Unable to process xpath.'})
            // console.error(err)
        }
    }

    return (
        <>
            <FormTextField
                disabled
                label='Relative XPath'
                name="relative_xpath"
                formik={formik}
                required
            />
            {/*{xpath}*/}
        </>
    )

}

export default RelativeXPath