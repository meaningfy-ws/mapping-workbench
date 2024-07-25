import {useEffect, useState} from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import {parseString, Builder} from "xml2js";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import {Layout as AppLayout} from 'src/layouts/app';
import {schemaFileResourcesApi as schemaFiles} from 'src/api/schema-files/file-resources'
import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'

const Page = () => {
    const [xPaths, setXPaths] = useState([])
    const [selectedLine, setSelectedLine] = useState(null);
    const [xmlContent,setXmlContent] = useState('')
    const [selectedNode, setSelectedNode] = useState('')
    const [nodesList, setNodesList] = useState([])
    const [files,setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState('')


    useEffect(() => {
        schemaFiles.getItems({})
            .then(res => setFiles(res))
            .catch(err => console.error(err))

        fieldsRegistry.getXpathsList()
            .then(res => {
                console.log(res)
                setXPaths(res)
            })
            .catch(err => console.error(err))
    },[])


    useEffect(() => {
        parseString(selectedFile.content, { explicitArray: false }, (err, result) => {
              if (err) {
                console.error('Error parsing XML:', err);
              } else {
                const builder = new Builder
                setXmlContent(builder.buildObject(result))
              }
            });
    },[selectedFile])


  const findXPaths = (xmlString) => {
    const lines = xmlString.split('\n');
    let xpaths = [];
    let xpathStack = [];

    lines.forEach((line, index) => {
        line = line.trim();
        if( line.startsWith('<!') || line.startsWith('<?') || line.endsWith('-->'))
            //tags that are not used
            xpaths.push('')
            // xpaths.push({xpath:[]})
        else if (line.startsWith('<') && !line.startsWith('</')) {
            // Opening tag
            const tagName = line.match(/<([^\s>]+)/)[1];
            xpathStack.push(tagName);
            xpaths.push(`${xpathStack.join('/')}`);
            // xpaths.push({xpath:xpathStack.join('/')})
            // Self-closing tag
            if (line.includes('</')) {
                xpathStack.pop();
            }
        } else if (line.startsWith('</') || (!line.startsWith('<') && line.includes('</'))) {
            // Closing tag
            xpaths.push(`${xpathStack.join('/')}`);
            // xpaths.push({xpath:xpathStack})
            xpathStack.pop();
        } else {
            // Text node or whitespace, ignore for XPaths
            xpaths.push('')
            // xpaths.push({xpath:[]})
        }
    });

    return xpaths.map(e=>{
        const res = e.split('/')
        res.shift()
        res.join('/')
        return res
    });
}

  const findedXpath = findXPaths(xmlContent)


  const handleLineClick = (lineNumber) => {
    setSelectedNode(findedXpath[lineNumber - 1]);
    setSelectedLine(lineNumber)
      // const xpathForLine = findedXpath[lineNumber - 1].split('/')
      // console.log(xpathForLine.shift())
// console.log(xpathForLine.join('/'))
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
          <TextField
            fullWidth
            label="File"
            name="fileSelect"
            onChange={event => setSelectedFile(event.target.value)}
            value={files[0]}
            select
          >
              {files.map((file) => (
                  <MenuItem
                    key={file.filename}
                    value={file}
                  >
                      <Typography>
                        {file.filename}
                      </Typography>
                  </MenuItem>
              ))}
          </TextField>
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
                                             {renderRow(node.children, stylesheet, xPaths.some(e=>e.xpath.replace('/*/','').endsWith(findedXpath[i])))}
                                        </span>
                                  })}}
              lineProps={(lineNumber) => ({
                  style: {cursor: 'pointer', backgroundColor: selectedLine === lineNumber ? '#e0e0e0' : 'inherit',hljsTag:'black'},
                  onClick: () => handleLineClick(lineNumber),
              })}
          >
              {xmlContent}
          </SyntaxHighlighter>}
          {<ul>
              {xPaths.map(e => <li>{e.xpath.replace('/*/','')}</li>)}
          </ul>}
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
              {/*{findedXpath.map(e => <li style={{color:'blue'}}>{e.join('/')}</li>)}*/}
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
