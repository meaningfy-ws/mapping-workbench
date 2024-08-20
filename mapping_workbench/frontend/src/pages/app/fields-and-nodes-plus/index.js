import {useEffect, useRef, useState} from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { parseString } from 'xml2js';
import {Layout as AppLayout} from 'src/layouts/app';
const Page = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [parsedXml, setParsedXml] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [noNodeRow,setNoNodeRow] = useState([])

    const misNodes = useRef([])


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlString = e.target.result;
        // console.log('xmlString',xmlString)
        parseString(xmlString, { explicitArray: false }, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err);
          } else {
            setXmlContent(xmlString);
            setParsedXml(result);
            console.log(xmlString)
            const allTagLines = xmlString.split(' ')
                .map((e,i)=>(e.includes('<'&&e.includes('>')) ? -1 : i))
                // .filter(e => e>=0)
              console.log('allTagLines',allTagLines)
              const allNodes = findAllNodes(result);
            setNodes(allNodes);
          }
        });
      };
      reader.readAsText(file);
    }
  };

  // Function to find all nodes and their XPaths
   const findAllNodes = (node, path = '') => {
    const result = [];

    const recursiveFind = (currentNode, currentPath) => {
      if (typeof currentNode === 'object') {
        let hasChildren = false;
        let lastLevelNode = false
          let outNode = false

          console.log('currentNode',currentNode,Object.keys(currentNode))
        // for (const key in currentNode) {
        for (let i =0; i< Object.keys(currentNode).length; i++) {
            const key = Object.keys(currentNode)[i]

          if (Object.hasOwnProperty.call(currentNode, key)) {
            // Ignore attributes; attributes are typically denoted with '@' prefix
              console.log(key, typeof key)
            // if (key.startsWith('$')) continue;

            const value = currentNode[key];
            const newPath = `${currentPath}/${key}`;

            if (typeof value === 'object') {
              hasChildren = true;
              if(value._) lastLevelNode = true
              result.push({ path: newPath, node: value });
              console.log(value,typeof value)
                if(Array.isArray(value))
                    value.map(e=>recursiveFind(e,newPath))
                else
                  recursiveFind(value, newPath);
            } else if (value && typeof value === 'string') {
              // Skip text nodes
              // continue;
                result.push({ path: newPath, node: value });
            }
          }
          if(i===Object.keys(currentNode).length - 1)
              outNode=true
          //   result.push({ path: `${currentPath}</>`, node: {} });
        }

        // Include closing tag if the node has children
        if ((hasChildren && lastLevelNode)) {
          result.push({ path: `${currentPath}</>`, node: {} });
        }
      }
    };

    recursiveFind(node, path);
    return result.filter(e=> !['$','/_'].some(val => e.path.includes(val)));
  };


   const collectNodeText = (node) => {
       let haveTag = false
       if(node?.children && ['token','tag'].some(e =>node.properties?.className.includes(e)))
           haveTag = true
        if(node?.children && ['token','tag'].every(e =>node.properties?.className.includes(e)) && !['punctuation','attr-name','attr-value'].some(e => node.properties?.className.includes(e)) )
            return node?.children.map(e=>e.value).join('').replace(' ','')

        if(node?.children)
            return node.children.map(e=>collectNodeText(e))
        // return node.value
    }

    const renderRow = (rows, css, highlight) => {
        return rows.map((node, i) => {
            const nodeCss = Object.assign({}, ...node.properties?.className.map(e=>css[e]).filter(e => e) ?? [])
            return <span key={node.properties?.key ?? i}
                         className={node.properties?.className?.join(' ')}
                         // onClick={node.properties?.onClick}
                         style={  {...nodeCss, ...node.properties?.style }}
                    >
                        {node.children ? renderRow(node.children, css, false) : node.value}
                    </span>
        });
    }

                   let nnr =[]

    console.log(misNodes)

  return (
    <div>
      <input type="file" accept=".xml" onChange={handleFileUpload} />
      {xmlContent && (
        <>
          <SyntaxHighlighter
            language="xml"
            // style={docco}
              showLineNumbers
            // wrapLines={true}
               renderer={({ rows, stylesheet, useInlineStyles }) => {
                            console.log(rows)
                             return rows.map((node, i) => {
                                 const nodeCss = Object.assign({}, ...node.properties?.className.map(e=>css[e]).filter(e => e) ?? [])
                                 console.log('nnd',node,collectNodeText(node).join(''),!!collectNodeText(node).join(''))

                                 // if(!collectNodeText(node).join('')) {
                                 //     misNodes.current.push(i)
                                 // }
                                     // setrowsNoNodeRow(e=>([...e,i]))
                                 //     setNodes( [
                                 //                ...nodes.slice(0, i),
                                 //                '',
                                 //                ...nodes.slice(i)
                                 //            ]);
                                 return <span key={node.properties?.key ?? i}
                                      onClick={() => node.properties.onClick()}
                                               style={  {...nodeCss, ...node.properties?.style}}
                                        >
                                             {renderRow(node.children, stylesheet)}
                                        </span>
                                  })}}
             lineProps={(lineNumber) => ({
                          style: { display: "block", cursor: "pointer" },
                          // onMouseEnter() {
                          //     setHoveredLine(lineNumber)
                          //     console.log(lineNumber)
                          // },
                          onClick() {
                              console.log(nodes[lineNumber-4])
                            // alert(`Line Number Clicked: ${lineNumber}`);
                          },
                        })}
          >
            {xmlContent}
          </SyntaxHighlighter>
          <h2>Nodes and XPaths</h2>
          <ul>
            {nodes.map((item, index) => (
              <li key={index}>
                <strong>{index} XPath:</strong> {item.path} <br />
                {/*<strong>Node:</strong> {JSON.stringify(item.node)}*/}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};


Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
