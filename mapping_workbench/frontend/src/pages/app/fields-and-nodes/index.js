import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { XMLParser } from 'fast-xml-parser';

import {Layout as AppLayout} from 'src/layouts/app';
import {parseString, Builder} from "xml2js";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const Page = () => {
    const [selectedLine, setSelectedLine] = useState(null);
    const [xmlContent,setXmlContent] = useState('')
    const [selectedNode, setSelectedNode] = useState('')
    const [nodesList, setNodesList] = useState([])


const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlString = e.target.result;
        parseString(xmlString, { explicitArray: false }, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err);
          } else {
            const builder = new Builder
            setXmlContent(builder.buildObject(result))
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const findXPaths = (xmlString) => {
    const lines = xmlString.split('\n');
    let xpaths = [];
    let xpathStack = [];

    lines.forEach((line, index) => {
        line = line.trim();
        if( line.startsWith('<!') || line.startsWith('<?') || line.endsWith('-->'))
            xpaths.push('')
        else if (line.startsWith('<') && !line.startsWith('</')) {
            // Opening tag
            const tagName = line.match(/<([^\s>]+)/)[1];
            xpathStack.push(tagName);
            xpaths.push(`${xpathStack.join('/')}`);
            // Self-closing tag
            if (line.includes('</')) {
                xpathStack.pop();
            }
        } else if (line.startsWith('</') || (!line.startsWith('<') && line.includes('</'))) {
            // Closing tag
            xpaths.push(`${xpathStack.join('/')}`);
            xpathStack.pop();
        } else {
            // Text node or whitespace, ignore for XPaths
            xpaths.push('')
        }
    });

    return xpaths;
}

  const findedXpath = findXPaths(xmlContent)


  const handleLineClick = (lineNumber) => {
    setSelectedNode(findedXpath[lineNumber - 1]);
    setSelectedLine(lineNumber)
  };
    const renderRow = (rows, css, highlight) => {
        return rows.map((node, i) => {
            const nodeCss = Object.assign({}, ...node.properties?.className.map(e=>css[e]).filter(e => e) ?? [])
            const isTagNode = ['token','tag'].every(e =>node.properties?.className.includes(e))
                && !['punctuation','attr-name','attr-value'].some(e => node.properties?.className.includes(e))
                && node.children?.[0]?.value !== ' '
            return <span key={node.properties?.key ?? i}
                         className={node.properties?.className?.join(' ')}
                         // onClick={node.properties?.onClick}
                         style={  {...nodeCss, ...node.properties?.style, backgroundColor: isTagNode && highlight ? 'yellow' : ''}}
                    >
                        {node.children ? renderRow(node.children, css, false) : node.value}
                    </span>
        });
    }

  return (
      <div>
          <input type="file"
                 accept=".xml"
                 onChange={handleFileUpload}/>
          {xmlContent && <SyntaxHighlighter
              // customStyle={customStyles}
              language="xml"
              // style={docco}
              showLineNumbers
              wrapLines
              renderer={({ rows, stylesheet, useInlineStyles }) => {
                             return rows.map((node, i) => {

                                  const nodeCss = Object.assign({}, ...node.properties?.className.map(e=>css[e]).filter(e => e) ?? [])
                                  return <span key={node.properties?.key ?? i}
                                               onClick={node.properties.onClick}
                                               style={  {...nodeCss, ...node.properties?.style}}
                                        >
                                             {renderRow(node.children, stylesheet, nodesList.includes(findedXpath[i]))}
                                        </span>
                                  })}}
              lineProps={(lineNumber) => ({
                  style: {cursor: 'pointer', backgroundColor: selectedLine === lineNumber ? '#e0e0e0' : 'inherit',hljsTag:'black'},
                  onClick: () => handleLineClick(lineNumber),
              })}
          >
              {xmlContent}
          </SyntaxHighlighter>}
          {/*{<ul>*/}
          {/*    {findedXpath.map(e => <li>{e}</li>)}*/}
          {/*</ul>}*/}
          <TextField
              value={selectedNode}
          />
          <Button onClick={()=> {
              if(selectedNode) {
                  setNodesList(e => ([...e, selectedNode]))
                  setSelectedNode('')
              }
          }}
                  disabled={!selectedNode}
          >
            Save
          </Button>
          {<ul>
              {nodesList.map(e => <li>{e}</li>)}
          </ul>}
      </div>
  );
};



Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
