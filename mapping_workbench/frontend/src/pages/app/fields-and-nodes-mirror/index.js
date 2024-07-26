import {Layout as AppLayout} from 'src/layouts/app';
import React, { useEffect, useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/xml/xml';
import XMLData from 'cn_81'


const Page = () => {
  const editorRef = useRef();

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    editor.on('mousedown', (instance, event) => {
      console.log('md')
      const pos = instance.coordsChar({ left: event.clientX, top: event.clientY }, 'window');
      const token = instance.getTokenAt(pos);

      console.log(token)

      if (token.type === 'attribute') {
        const attributeName = token.string;
        const elementPos = instance.coordsChar({ left: event.clientX - token.start, top: event.clientY }, 'window');
        const elementToken = instance.getTokenAt(elementPos);

        if (elementToken.type === 'tag') {
          const elementName = elementToken.string;
          const xpath = generateXPath(instance.getValue(), elementName, attributeName);
          console.log(xpath);
        }
      }
    });
  };

  const generateXPath = (xml, elementName, attributeName) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');

    const xpathResult = xmlDoc.evaluate(`//${elementName}[@${attributeName}]`, xmlDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (xpathResult.singleNodeValue) {
      const element = xpathResult.singleNodeValue;
      return getElementXPath(element);
    }
    return null;
  };

  const getElementXPath = (element) => {
    if (element.id !== '') {
      return `id("${element.id}")`;
    }
    if (element === document.body) {
      return element.tagName.toLowerCase();
    }
    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        return `${getElementXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
      }
      if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
        ix++;
      }
    }
  };

  return (
    <CodeMirror
      value={XMLData}
      htmlMode
      options={{
        mode: 'xml',
        lineNumbers: true,
      }}
      editorDidMount={handleEditorDidMount}
    />
  );
};




Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
