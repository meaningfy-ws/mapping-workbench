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


    const collectNodeText = (node) => {
        if(node?.children && ['token','tag'].every(e =>node.properties?.className.includes(e)) && !['punctuation','attr-name','attr-value'].some(e => node.properties?.className.includes(e)) )
            return node?.children.map(e=>e.value).join('').replace(' ','')

        if(node?.children)
            return node.children.map(e=>collectNodeText(e))
        // return node.value
    }


    const highlightLines = (editor, start, end) => {
      const from={line: start, ch: 0};
      const to= {line: end, ch: 10};
      editor.markText(from, to, {className: "codemirror-highlighted"});
    }

     const handleLineClick = (cm, lineNumber) => {
        console.log(cm)
        const doc = cm.getDoc();
        const line = doc.getLine(lineNumber);
        console.log('line',line)
        const element = doc.markText({line: lineNumber, ch: 0}, {line: lineNumber, ch: line.length});
        const xmlElement = new DOMParser().parseFromString(line, "text/xml").documentElement;

        // console.log('handleLineClick',cm,lineNumber)
        // const line = cm.getLine(lineNumber);
        // alert(`Line ${lineNumber + 1} clicked: ${line}`);
        if (xmlElement) {
              const xpath = getXPath(xmlElement);
              console.log(xpath)
          }
        };


     const getElementByLineNumber = (element, lineNumber) => {
        let currentLine = 1;
        const traverse = (node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            if (currentLine === lineNumber) {
              return node;
            }
            currentLine++;
          }

          let result = null;
          for (let i = 0; i < node.childNodes.length; i++) {
            result = traverse(node.childNodes[i]);
            if (result) return result;
          }
          return null;
    };


     const onMount = (editor) => {
        editor.on('gutterClick', (cm, lineNumber) => handleLineClick(cm, lineNumber));
        editor.on('hover')
     };


     // const lines = [];
     // const xpathsList = [];
     // XMLData.forEach((row, index) => {
     //    if (index > 0) { // assuming the first row is headers
     //      lines.push(row[0]); // assuming your content is in the first column
     //      xpathsList.push(row[1]); // assuming your XPaths are in the second column
     //    }
     // });


    const getXPath = (element, path = []) => {
        console.log(element,path,element.nodeType)
        if (element.nodeType === Node.DOCUMENT_NODE) {
          return '/' + path.join('/');
        }

        const { nodeName, parentNode } = element;
        console.log('nodeName:',nodeName,'parentNode:',parentNode)
        const siblings = Array.from(parentNode.childNodes).filter(sibling => sibling.nodeName === nodeName);
        const index = siblings.indexOf(element) + 1;
        path.unshift(`${nodeName}[${index}]`);

        return getXPath(parentNode, path);
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
