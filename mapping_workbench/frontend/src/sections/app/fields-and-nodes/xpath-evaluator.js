import {useEffect, useRef, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {basicSetup} from '@uiw/codemirror-extensions-basic-setup';
import {xml} from '@codemirror/lang-xml'
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import {TableNoData} from "../shacl_validation_report/utils";

const XpathEvaluator = ({xmlDoc, absolute_xpath}) => {
    const [nodes, setNodes] = useState([])

    useEffect(() => {
        if (!!xmlDoc && absolute_xpath)
            evaluateXPAthExpression(absolute_xpath, xmlDoc)
    }, [xmlDoc, absolute_xpath]);

    const extractNamespaces = (doc) => {
        const root = doc.documentElement;
        const attributes = root.attributes;
        const namespaces = {};

        for (let attr of attributes) {
            if (attr.name.startsWith('xmlns:')) {
                const prefix = attr.name.split(':')[1];
                namespaces[prefix] = attr.value;
            }
        }

        return namespaces;
    }


    const evaluateXPAthExpression = (xpathExpr, xmlDoc) => {
        setNodes([])
        // Extract namespaces from the XML
        const namespaces = extractNamespaces(xmlDoc);

        // Function to resolve namespaces in XPath expressions
        const nsResolver = (prefix) => namespaces[prefix] || null;

        try {
            // console.log(xmlDoc.evaluate(xpathExpr,xmlDoc,nsResolver,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null))
            const allNodes = []

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

            setNodes(allNodes)
        } catch (err) {
            // formik.setErrors({relative_xpath: 'Unable to process xpath.'})
            console.error(err)
        }
    }

    const serializer = new XMLSerializer()

    return (
        <>
            <Accordion disabled={!nodes.length}>
                <AccordionSummary>
                    <Typography>{`Nodes found: ${nodes.length}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {nodes.map((e, i) => (
                        <Card key={'node' + i}>
                            <CodeMirror
                                style={{resize: 'vertical', overflow: 'auto', height: 200}}
                                value={serializer.serializeToString(e)}
                                editable={false}
                                extensions={[xml()]}
                                foldGutter={true}

                                options={{
                                    mode: 'application/xml',
                                    theme: 'default',
                                    lineNumbers: false,
                                    foldGutter: true,
                                }}
                            />
                        </Card>))}
                    {!nodes.length && <TableNoData/>}
                </AccordionDetails>
            </Accordion>
        </>
    )

}


export default XpathEvaluator