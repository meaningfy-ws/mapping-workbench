import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { parseString } from 'xml2js';
import {Layout as AppLayout} from 'src/layouts/app';
const Page = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [parsedXml, setParsedXml] = useState(null);
  const [nodes, setNodes] = useState([]);

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
            setXmlContent(xmlString);
            setParsedXml(result);
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
        for (const key in currentNode) {
          if (Object.hasOwnProperty.call(currentNode, key)) {
            // Ignore attributes; attributes are typically denoted with '@' prefix
            if (key.startsWith('$')) continue;

            const value = currentNode[key];
            const newPath = `${currentPath}/${key}`;
            if (typeof value === 'object') {
              result.push({ path: newPath, node: value });
              recursiveFind(value, newPath);
            } else {
              result.push({ path: newPath, node: value });
            }
          }
        }
      }
    };

    recursiveFind(node, path);
    return result;
  };

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
