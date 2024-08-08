import {useEffect, useState} from "react";
import {parseString} from "xml2js";

import Alert from "@mui/material/Alert";
import classNames from "classnames/bind";
import styles from './styles/style.module.scss'

const MARGIN = 14
const ATTRIBUTE_SIGN = '$'
const NAME_SIGH = '_'

const cx = classNames.bind(styles);

const Attribute = ({name, value, parent, handleClick}) => {
    return (
        <span onClick={() => handleClick([...parent, `[${name}='${value}']`].join('/'))}
              className={cx('attr')}>
                <span className={cx('attr-name')}>{` ${name}=`}</span>
                <span>{'"'}</span>
                    <span className={cx('attr-value')}>{value}</span>
                <span>{'"'}</span>
            </span>)
}

const Tag = ({name, attributes, children, parent, level, isField, xpaths, handleClick}) => {
    const nodeXPath = [...parent, name].join('/')
    const selectedNode = xpaths?.some(xpath => nodeXPath.endsWith(xpath))
    return (
        <span style={{marginLeft: level * MARGIN}}
              className={cx('text-color')}>
               <span>{'<'}</span>
               <span name='tag'
                     className={cx('tag', {
                         'tag-selected-field': (selectedNode && isField),
                         'tag-selected-node': (selectedNode && !isField)
                     })}
                     onClick={() => handleClick([...parent, name].join('/'))}>
                   {name}
               </span>
            {attributes && <span name={'attributes'}>{Object.entries(attributes).map(([name, value]) =>
                <Attribute key={name}
                           name={name}
                           handleClick={handleClick}
                           value={value}
                           parent={parent}/>)}
           </span>}
            <span>{'>'}</span>
            {!isField && <br/>}
            {children}
            <span style={{marginLeft: isField ? 0 : level * MARGIN}}>{'</'}</span>
           <span name='close-tag'
                 className={cx('tag', {
                     'tag-selected-field': (selectedNode && isField),
                     'tag-selected-node': (selectedNode && !isField)
                 })}
                 onClick={() => handleClick([...parent, name].join('/'))}>
               {name}
           </span>
           <span>{'>'}</span>
               <br/>
        </span>)
}

const executeXPaths = (xmlContent, xPaths) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, "application/xml");
    const namespaces = extractNamespaces(doc);

    const nsResolver = (prefix) => namespaces[prefix] || null;

    const evaluatedNamespaces = []

    xPaths.forEach(xPath => {
        try {
            const evaluated = doc.evaluate(
                xPath.xpath,
                doc,
                nsResolver,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null,
            );

            console.log(xPath)

            if (evaluated.snapshotLength > 0) {
                for (let i = 0; i < evaluated.snapshotLength; i++) {
                    const node = evaluated.snapshotItem(i);
                    const absoluteXPath = getAbsoluteXPath(node);
                    evaluatedNamespaces.push(absoluteXPath)
                }
            } else {
                // console.log('No nodes found.');
            }

        } catch (err) {
            console.log(err)
        }
    })
    return evaluatedNamespaces
}


const BuildNodes = ({nodes, level, parent, xpaths, handleClick}) => {
    return nodes.map((e) => {
            const [name, value] = e
            if (['0', '1', '2', '3'].includes(name))
                return <BuildNodes nodes={Object.entries(value).filter(en => en[0] !== ATTRIBUTE_SIGN)}
                                   key={'obj' + name}
                                   level={level}
                                   xpaths={xpaths}
                                   handleClick={handleClick}
                                   parent={[...parent, name]}/>
            if (typeof value == "string")
                if (name !== NAME_SIGH)
                    return (
                        <Tag key={'tag' + name}
                             name={name}
                             isField
                             parent={parent}
                             xpaths={xpaths}
                             handleClick={handleClick}
                             level={level}>
                            <span className={cx('string-content')}>
                                {value}
                            </span>
                        </Tag>)
                else
                    return <span key={name}>
                                <span className={cx('string-content')}>
                                    {value}
                                </span>
                            </span>
            return (
                <Tag key={'tag' + name}
                     name={name}
                     attributes={value?.[ATTRIBUTE_SIGN]}
                     parent={parent}
                     xpaths={xpaths}
                     handleClick={handleClick}
                     isField={Object.entries(value).some(e => e[0] === NAME_SIGH)}
                     level={level}>
                    <BuildNodes nodes={Object.entries(value).filter(en => en[0] !== ATTRIBUTE_SIGN)}
                                level={level + 1}
                                xpaths={xpaths}
                                handleClick={handleClick}
                                parent={[...parent, name]}/>
                </Tag>)
        }
    )
}

const extractNamespaces = (doc) => {
    const root = doc.documentElement;
    const attributes = root.attributes;
    const namespaces = {};

    for (let attr of attributes) {
        if (attr.name.startsWith('xmlns:')) {
            const prefix = attr.name.split(':')[1];
            namespaces[prefix] = attr.value;
        }
    }

    return namespaces;
}

const getAbsoluteXPath = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
    }
    const parts = [];
    while (node?.nodeType === Node.ELEMENT_NODE) {
        const nodeName = node.nodeName;
        parts.unshift(nodeName);
        node = node.parentNode;
    }
    return `/${parts.join('/')}`;
}

const File = ({xmlContent, xPaths, handleClick}) => {
    const [xmlNodes, setXmlNodes] = useState(false)
    const [error, setError] = useState(false)
    const [xPathsInFile, setXPathsInFile] = useState([])

    useEffect(() => {
        setError(false)
        xmlContent &&
        parseString(xmlContent, {explicitArray: false}, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                setError(err)
            } else {
                setXmlNodes(result)
            }
        });
        if (xmlContent) {
            setXPathsInFile(executeXPaths(xmlContent, xPaths))
        }
    }, [xmlContent])


    return (
        <>
            {error && <Alert severity="error">{error.message}</Alert>}
            {!!xmlNodes && !error && <div className={cx('container')}>
                <BuildNodes nodes={Object.entries(xmlNodes)}
                            level={0}
                            handleClick={handleClick}
                            xpaths={xPathsInFile}
                            parent={[]}/>
            </div>}
        </>
    )
}

export default File