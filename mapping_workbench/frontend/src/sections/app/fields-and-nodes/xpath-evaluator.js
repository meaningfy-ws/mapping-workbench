import {useEffect, useRef, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {basicSetup} from '@uiw/codemirror-extensions-basic-setup';
import {xml} from '@codemirror/lang-xml'
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const XpathEvaluator = ({xmlDoc, absolute_xpath}) => {

    const [nodes, setNodes] = useState([])

    useEffect(() => {
        if (!!xmlDoc && absolute_xpath)
            evaluateXPAthExpression(getGlobalXPath(absolute_xpath), xmlDoc)
    }, [xmlDoc, absolute_xpath]);

    const getGlobalXPath = (xpath) => {
        const xp = xpath.split('/')
        xp.shift()
        return '/*/' + xp.join('/')
    }

    const extractNamespaces = (doc) => {
        const root = doc.documentElement;
        const attributes = root.attributes;
        const namespaces = {};

        for(let attr of attributes) {
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
        !!nodes.length &&
        <>
            <Typography>{`Nodes found: ${nodes.length}`}</Typography>
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
                            foldOptions: {
                                widget: (from, to) => {
                                    var count = undefined;

                                    // Get open / close token
                                    var startToken = '{', endToken = '}';
                                    var prevLine = window.editor_json.getLine(from.line);
                                    if (prevLine.lastIndexOf('[') > prevLine.lastIndexOf('{')) {
                                        startToken = '[', endToken = ']';
                                    }

                                    // Get json content
                                    var internal = window.editor_json.getRange(from, to);
                                    var toParse = startToken + internal + endToken;

                                    // Get key count
                                    try {
                                        var parsed = JSON.parse(toParse);
                                        count = Object.keys(parsed).length;
                                    } catch (e) {
                                    }

                                    return count ? `\u21A4${count}\u21A6` : '\u2194';
                                }
                            }
                            // foldCode: true,
                            // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                        }}

                        // onCreateEditor={handleEditorDidMount}


                    />
                </Card>))}
        </>
    )

}


export default XpathEvaluator