import {useEffect, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {basicSetup} from '@uiw/codemirror-extensions-basic-setup';
import {xml} from '@codemirror/lang-xml'
import Card from "@mui/material/Card";

const XpathEvaluator = ({xmlDoc, xpath, absolute_xpath}) => {

    const [nodes, setNodes] = useState([])


    useEffect(() => {
        if (!!xmlDoc && xpath && absolute_xpath)
            evaluateXPAthExpression(xpath, getGlobalXPath(absolute_xpath), xmlDoc)
    }, [xmlDoc, xpath, absolute_xpath]);

    const getGlobalXPath = (xpath) => {
        const xp = xpath.split('/')
        xp.shift()
        return '/*/' + xp.join('/')
    }

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


    const evaluateXPAthExpression = (contextNodeExpr, xpathExpr, xmlDoc) => {
        // Extract namespaces from the XML
        const namespaces = extractNamespaces(xmlDoc);

        // Function to resolve namespaces in XPath expressions
        const nsResolver = (prefix) => namespaces[prefix] || null;

        try {
            // console.log(xmlDoc.evaluate(xpathExpr,xmlDoc,nsResolver,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null))
            const allNodes = []
            const contextResult = xmlDoc.evaluate(contextNodeExpr, xmlDoc, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const contextNode = contextResult.singleNodeValue;
            console.log('contextNode', contextNode)
            if (contextNode) {
                const result = xmlDoc.evaluate(xpathExpr, xmlDoc, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                if (result.snapshotLength > 0) {
                    for (let i = 0; i < result.snapshotLength; i++) {
                        const node = result.snapshotItem(i);
                        allNodes.push(node)
                        // setNodes(nds => ([...nds, node]))
                    }
                } else {
                    // formik.setErrors({relative_xpath: 'No nodes found.'})
                    console.log('No nodes found.');
                }
            } else {
                // formik.setErrors({relative_xpath: 'Context node not found.'})
                console.log('Context node not found.');
            }
            setNodes(allNodes)
        } catch (err) {
            // formik.setErrors({relative_xpath: 'Unable to process xpath.'})
            console.error(err)
        }
    }

    const serializer = new XMLSerializer()

    return (
        <>
            {nodes.map((e, i) => {
                return <Card key={'node' + i}>
                    <CodeMirror
                        value={serializer.serializeToString(e)}
                        editable={false}
                        extensions={[basicSetup(), xml()]}
                        options={{
                            mode: 'text/xml',
                            theme: 'default',
                            lineNumbers: false,
                        }}
                    />
                </Card>
            })}
        </>
    )

}


export default XpathEvaluator