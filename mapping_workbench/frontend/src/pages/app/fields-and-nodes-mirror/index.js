import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import XMLData from 'cn_81'
import {Controlled as CodeMirror} from 'react-codemirror2'
import {useEffect, useRef, useState} from "react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
// import 'codemirror/mode/xml/xml';
// import 'codemirror/theme/neat.css';
// import 'codemirror/mode/javascript/javascript.js';
                      // import { xml } from '@codemirror/lang-xml'
// require('codemirror/mode/xml/xml');

const Page = () => {

    const codeMirrorRef = useRef()
    // const language = () => [import('codemirror/mode/xml/xml')];

    const [load,setLoad] = useState(false)

    useEffect(() => {
        dinamycImport()
            .then(() => setLoad(true))
        // const current = codeMirrorRef.current?.editor.display.wrapper.style.height = "1000px";
    }, []);


    const dinamycImport = async ()  => {
        await import('codemirror/mode/xml/xml')
    }

    const [listOfNodes, setListOfNodes] = useState(['ContractNotice','UBLExtension'])
    const [nodeValue,setNodeValue] = useState('')
    const [hoveredLine, setHoveredLine] = useState(-1)


    const highlightLines = (editor, start, end) => {
      const from={line: start, ch: 0};
      const to= {line: end, ch: 10};
      editor.markText(from, to, {className: "codemirror-highlighted"});
    }

    const handleLineClick = (cm, lineNumber) => {
        const doc = cm.getDoc();
        const line = doc.getLine(lineNumber);

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(XMLData, "application/xml");
            console.log('xmlDoc', xmlDoc, lineNumber)
            const element = getElementByLineNumber(xmlDoc.documentElement, lineNumber + 3);

            console.log('ee', element)
            let es=element
            const parentRoot=[]
            while(es.parentNode) {
                console.log('es',es.nodeName)
                parentRoot.push(es.parentNode.nodeName)
                es=es.parentNode

            }
            console.log(parentRoot)
            //   console.log(getElementByLineNumber1(xmlDoc.documentElement,lineNumber+2))
            //   console.log('line',line)
            //   console.log('element',element,element.tagName)
            //   if (element) {
            //     const parentNodes = getParentNodes(element);
            //     if (parentNodes.length > 0) {
            //       // alert(`Parent nodes: ${[element.tagName,...parentNodes.map(node => node.nodeName)].reverse().join('/')}`);
            //       console.log([element.tagName,...parentNodes.map(node => node.nodeName)].reverse().join('/'))
            //     } else {
            //       alert(`No parent nodes found for line ${lineNumber + 1}`);
            //     }
            //   } else {
            //     alert(`No XML element found at line ${lineNumber + 1}`);
            //   }
        } catch (error) {
            console.error('Error parsing XML:', error);
            //   alert(`Error parsing XML at line ${lineNumber + 1}`);
        }
    };

    const getElementByLineNumber1 = (element, lineNumber, doc) => {
    let currentLine = 1;
    const xmlLines = XMLData.split('\n');

    const traverse = (node) => {
      if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
        // const nodeXml = new XMLSerializer().serializeToString(node).split('\n');
        currentLine ++;
        // console.log(nodeXml)
        console.log(node)
        if (currentLine >= lineNumber) {
          return node;
        }
      }

      let result = null;
      for (let i = 0; i < node.childNodes.length; i++) {
        result = traverse(node.childNodes[i]);
        if (result) return result;
      }
      return null;
    };

    return traverse(element);
  };

    const getElementByLineNumber = (element, lineNumber) => {
        let currentLine = 0;
        console.log('getElement',element)
        const traverse = (node) => {
          console.log(currentLine,node)
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            if (currentLine === lineNumber) {
              return node;
            }
            currentLine++;
          }

          let result = null;
          console.log(node.childNodes)
          for (let i = 0; i < node.childNodes.length; i++) {
            result = traverse(node.childNodes[i]);
            console.log(result)
            if (result) return result;
          }
          return null;
        };

        return traverse(element);
    };

  const getParentNodes = (node) => {
    const parents = [];
    let current = node;
    while (current.parentNode?.nodeType !== Node.DOCUMENT_NODE) {
      parents.push(current.parentNode);
      current = current.parentNode;
    }
    return parents;
  };


    return (
        <>
            <Seo title={`App: ${''} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {}
                        </Typography>
                        <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={paths.index}
                                variant="subtitle2"
                            >
                                App
                            </Link>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={'#'}
                                variant="subtitle2"
                            >
                                {/*{sectionApi.SECTION_TITLE}*/}
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                List
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                    </Stack>

                </Stack>
                <Card>
                    {load &&
                    <CodeMirror
                       style={{"height": "800px"}}
                       ref={codeMirrorRef}
                       value={XMLData}
                       options={{
                          mode: 'xml',
                          theme: 'material',
                          lineNumbers: true,
                          readOnly: true,
                       }}
                       // editorDidMount={editor => highlightLines(editor, 1, 4)}
                      // onFocus={e}
                      //  editorDidMount={onMount}
                        onGutterClick={(cm, lineNumber) => handleLineClick(cm, lineNumber)}
                       onRenderLine={(editor,line,element)=>console.log(editor,line,element)}
                       onFocus={e => console.log(e)}
                    />}
                </Card>
                <Input value={nodeValue}/><Button onClick={() => setListOfNodes(e=>([...e, nodeValue]))}>Save</Button>
            </Stack>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
