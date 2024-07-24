import React, { useState, useEffect } from 'react';
import {Layout as AppLayout} from 'src/layouts/app';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import xmlLang from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { XMLParser } from 'fast-xml-parser';
import XMLData from 'cn_81'

// Register the XML language for SyntaxHighlighter
// SyntaxHighlighter.registerLanguage('xml', xmlLang);

const Page = () => {
  const parser = new XMLParser()
  const [selectedLine, setSelectedLine] = useState(null);

  const xmlContent = XMLData

    const parser1 = new DOMParser();
    const xmlDoc = parser1.parseFromString(xmlContent, "application/xml");

    console.log('xmlDoc',xmlDoc)

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
            // if(line.startsWith('</')){
            //     xpaths.push(`${xpathStack.join('/')}`);
            // }
        } else if (line.startsWith('</')) {
            // Closing tag
            xpaths.push(`${xpathStack.join('/')}`);
            xpathStack.pop();
        } else {
            xpaths.push('')
            // Text node or whitespace, ignore for XPaths
        }
    });

    return xpaths;
}

console.log(xmlContent)
    const findedXpath = findXPaths(xmlContent)
  // console.log(findXPaths(xmlContent))


  const getXPathForLine = (xmlContent, lineNumber) => {
    const xmlDoc = parser.parse(xmlContent, { ignoreAttributes: false });
    const lines = xmlContent.split('\\n');
    let currentNode = xmlDoc;
    let currentPath = [];
    let xpaths = []

    for (let i = 0; i < lineNumber; i++) {
      const line = lines[i].trim();
      if (line.startsWith('<?') || line.startsWith('<!') || line.endsWith('-->'))
          xpaths.push('')
      if (line.startsWith('<') && !line.startsWith('</') && !line.startsWith('<?') && !line.startsWith('<!')) {
        const tagName = line.split(' ')[0].replace('<', '').replace('>', '');
        if(line.startsWith('<') && line.includes('>') && line.includes('</'))
        {
          console.log(line.substring(0, line.indexOf('>')))
          const tgn = line.substring(0, line.indexOf('>')).replace('<', '').replace('>', '');
          currentPath.push(tgn)
        }
        else currentPath.push(tagName);
        // console.log('tagName',tagName)
        // const tagName = line.substring(line.indexOf('<'),line.indexOf('>'))
        // currentPath.push(tagName);
      } else if (line.startsWith('</')) {
        // currentPath.pop();
      }
      xpaths.push(currentPath)
    }

    return xpaths
    // return '/' + currentPath.join('/');
  };

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
      <SyntaxHighlighter
        language="xml"
        // style={docco}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => ({
          style: { cursor: 'pointer', backgroundColor: selectedLine === lineNumber ? '#e0e0e0' : 'inherit' },
          onClick: () => console.log(findedXpath[lineNumber -1])
              // handleLineClick(lineNumber),
        })}
      >
        {xmlContent}
      </SyntaxHighlighter>
      {/*{selectedLine !== null && (*/}
      {/*  <div>*/}
      {/*    <p>Selected Line: {selectedLine}</p>*/}
      {/*    <p>XPath: {getXPathForLine(xmlContent, selectedLine)}</p>*/}
      {/*  </div>*/}
      {/*)}*/}
      {<ul>
        {findedXpath.map(e=><li>{e}</li>)}
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
