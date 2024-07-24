import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { XMLParser } from 'fast-xml-parser';

import {Layout as AppLayout} from 'src/layouts/app';
import XMLData from 'cn_81'
import {parseString, Builder} from "xml2js";


const Page = () => {
  const parser = new XMLParser()
  const [selectedLine, setSelectedLine] = useState(null);
  const [xmlContent,setXmlContent] = useState('')


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
    console.log(lines)
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


  useEffect(() => {
    if (selectedLine !== null) {
      const xpath = getXPathForLine(xmlContent, selectedLine);
      console.log('Selected Line:', selectedLine);
      console.log('XPath:', xpath);
    }
  }, [selectedLine]);

  const handleLineClick = (lineNumber) => {
    setSelectedLine(lineNumber);
  };

  return (
      <div>
          <input type="file"
                 accept=".xml"
                 onChange={handleFileUpload}/>
          {xmlContent && <SyntaxHighlighter
              language="xml"
              // style={docco}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                  style: {cursor: 'pointer', backgroundColor: selectedLine === lineNumber ? '#e0e0e0' : 'inherit'},
                  onClick: () => console.log(findedXpath[lineNumber - 1])
                  // handleLineClick(lineNumber),
              })}
          >
              {xmlContent}
          </SyntaxHighlighter>}
          {<ul>
              {findedXpath.map(e => <li>{e}</li>)}
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
