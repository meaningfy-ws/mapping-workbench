import {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from './styles/style.module.scss'

const MARGIN = 4
const ATTRIBUTE_SIGN = '$'
const NAME_SIGH = '_'

const cx = classNames.bind(styles);

const Attribute = ({name, value, parent, handleClick}) => {
    return (
        <span onClick={() => handleClick([...parent, `[${name}='${value}']`])}
              className={cx('attr')}>
                <span className={cx('attr-name')}>{` ${name}=`}</span>
                <span>{'"'}</span>
                    <span className={cx('attr-value')}>{value}</span>
                <span>{'"'}</span>
            </span>)
}

const Tag = ({name, attributes, children, parent, level, isField, relativeXPath, xPath, xPaths, handleClick}) => {

    const shiftedParent = [...parent]
    if(shiftedParent.length)
        shiftedParent.shift()
    const nodeXPath = ['/*',...shiftedParent, name].join('/')
    const selectedNode = xPaths?.some(xpath => nodeXPath.endsWith(xpath))

    const selectedXpath = xPath && nodeXPath === xPath
    return (
        <span style={{
            marginLeft: level * MARGIN,
            display: 'block',
            backgroundColor: selectedXpath ? '#ffacac' : 'inherit'
        }}
              className={cx('text-color')}>
               <span>{'<'}</span>
               <span name='tag'
                     className={cx('tag', {
                         'tag-selected-field': (selectedNode && isField),
                         'tag-selected-node': (selectedNode && !isField)
                     })}
                     onClick={() => handleClick([...parent, name])}>
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
                  onClick={() => handleClick([...parent, name])}>
               {name}
            </span>
            <span>{'>'}</span>
               <br/>
        </span>)
}

const executeXPaths = (doc, xPaths) => {
    const namespaces = extractNamespaces(doc);

    const nsResolver = (prefix) => namespaces[prefix] || null;

    const evaluatedNamespaces = []

    xPaths.forEach(xPath => {
        try {
            const evaluated = doc.evaluate(
                xPath.absolute_xpath,
                doc,
                nsResolver,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null,
            );


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
            // console.log(err)
        }
    })
    return  evaluatedNamespaces.filter(e => !!e).map(e=>{
        const shifted = e.split('/')
        shifted.shift()
        return shifted.join('/')
    })
}


const BuildNodes = ({nodes, level, parent, xPath, xPaths, relativeXPath, handleClick}) => {
    return nodes.map((e) => {
            const [name, value] = e
            if (!isNaN(name))
                return <BuildNodes nodes={Object.entries(value).filter(en => en[0] !== ATTRIBUTE_SIGN)}
                                   key={'obj' + name}
                                   level={level}
                                   xPath={xPath}
                                   xPaths={xPaths}
                                   handleClick={handleClick}
                                   relativeXPath={relativeXPath}
                                   parent={parent}/>
            if (typeof value == "string")
                if (name !== NAME_SIGH)
                    return (
                        <Tag key={'tag' + name}
                             name={name}
                             isField
                             parent={parent}
                             xPath={xPath}
                             xPaths={xPaths}
                             handleClick={handleClick}
                             relativeXPath={relativeXPath}
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
                     xPath={xPath}
                     xPaths={xPaths}
                     handleClick={handleClick}
                     relativeXPath={relativeXPath}
                     isField={Object.entries(value).some(e => e[0] === NAME_SIGH)}
                     level={level}>
                    <BuildNodes nodes={Object.entries(value).filter(en => en[0] !== ATTRIBUTE_SIGN)}
                                level={level + 1}
                                xPaths={xPaths}
                                xPath={xPath}
                                relativeXPath={relativeXPath}
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
    return `${parts.join('/')}`;
}

const File = ({xmlContent, fileContent, fileError, relativeXPath, xmlNodes, xPaths, xPath, handleClick}) => {
    const [xPathsInFile, setXPathsInFile] = useState([])
    useEffect(() => {
        if (fileContent && xmlContent && !fileError) {
            setXPathsInFile(executeXPaths(xmlContent, xPaths))
        }
    }, [xmlContent, fileContent, fileError, xmlNodes])


    return (
        <>
            {!!xmlNodes && <div className={cx('container')}>
                <BuildNodes nodes={Object.entries(xmlNodes)}
                            level={0}
                            handleClick={handleClick}
                            xPath={xPath}
                            xPaths={xPathsInFile}
                            relativeXPath={relativeXPath}
                            parent={[]}/>
            </div>}
        </>
    )
}

export default File