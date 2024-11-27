import {useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import {executeXPaths} from "./utils";

import styles from './styles/style.module.scss'

const MARGIN = 4
const ATTRIBUTE_SIGN = '$'
const NAME_SIGH = '_'

const styless = (name, themeDark) => {
    switch (name) {
        case 'attr':
        case 'attr-name':
            return themeDark ? '#79c0ff' : '#005cc5'
        case 'attr-value':
            return themeDark ? '#a5d6ff' : '#032f62'
        case 'tag':
            return themeDark ? '#7ee787' : '#116329'
        case 'brace':
            return themeDark ? '#8b949e' : '#6a737d'
        case 'field':
            return themeDark ? '#fbfb7c' : '#ffffbe'
        case 'node':
            return themeDark ? '#007f00' : 'lightgreen'
        case 'region':
            return themeDark ? '#007cd1' : '#e2f2ff'
        default:
            return themeDark ? '#c9d1d9' : '#24292e'
    }
}

const Attribute = ({name, value, parent, handleClick, theme}) => {
    const themeDark = theme.palette.mode === 'dark'
    return (
        <span onClick={() => handleClick([...parent, `[${name}='${value}']`])}
              style={{color: styless('attr', themeDark)}}
              className={styles.tag}
        >
                <span style={{color: styless('attr-name', themeDark)}}>{` ${name}=`}</span>
                <span style={{color: styless('attr-value', themeDark)}}>{`"${value}"`}</span>
        </span>)
}

const Tag = ({
                 name,
                 attributes,
                 children,
                 parent,
                 level,
                 isField,
                 relativeXPath,
                 xPath,
                 xPaths,
                 handleClick,
                 theme
             }) => {
    const shiftedParent = [...parent]
    if (shiftedParent.length)
        shiftedParent.shift()
    const nodeXPath = ['/*', ...shiftedParent, name].join('/')
    const selectedNode = xPaths?.some(xpath => nodeXPath.endsWith(xpath))

    const selectedXpath = xPath && nodeXPath === xPath

    const themeDark = theme.palette.mode === 'dark'
    return (
        <span style={{
            marginLeft: level * MARGIN,
            display: 'block',
            backgroundColor: selectedXpath && styless('region', themeDark),
            color: styless('brace', themeDark)
        }}
        >
            <span>{'<'}</span>
            <span name='tag'
                  style={{
                      color: styless('tag', themeDark),
                      backgroundColor: selectedNode && styless(isField ? 'field' : 'node', themeDark),
                  }}
                  className={styles.tag}
                  onClick={() => handleClick([...parent, name])}>
               {name}
            </span>
            {attributes && <span name={'attributes'}>{Object.entries(attributes).map(([name, value]) =>
                <Attribute key={name}
                           name={name}
                           handleClick={handleClick}
                           value={value}
                           theme={theme}
                           parent={parent}/>)}
            </span>}
            <span>{'>'}</span>
            {!isField && <br/>}
            {children}
            <span style={{marginLeft: 0}}>{'</'}</span>
            <span name='close-tag'
                  style={{
                      color: styless('tag', themeDark),
                      backgroundColor: selectedNode && styless(isField ? 'field' : 'node', themeDark)
                  }}
                  className={styles.tag}
                  onClick={() => handleClick([...parent, name])}>
               {name}
            </span>
            <span>{'>'}</span>
               <br/>
        </span>)
}


const BuildNodes = ({nodes, level = 0, parent = [], xPath, xPaths, relativeXPath, handleClick, theme}) => {
    return nodes.map((e) => {
            const [name, value] = e
            if (!isNaN(name))
                return <BuildNodes nodes={Object.entries(value).filter(en => en[0] !== ATTRIBUTE_SIGN)}
                                   key={'obj' + name}
                                   theme={theme}
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
                             theme={theme}
                             xPath={xPath}
                             xPaths={xPaths}
                             handleClick={handleClick}
                             relativeXPath={relativeXPath}
                             level={level}>
                            <span style={{color: theme?.palette?.text?.primary}}>
                                {value}
                            </span>
                        </Tag>)
                else
                    return <span key={name}>
                                <span style={{color: theme?.palette?.text?.primary}}>
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
                     theme={theme}
                     handleClick={handleClick}
                     relativeXPath={relativeXPath}
                     isField={Object.entries(value).some(e => e[0] === NAME_SIGH)}
                     level={level}>
                    <BuildNodes nodes={Object.entries(value).filter(en => en[0] !== ATTRIBUTE_SIGN)}
                                level={level + 1}
                                xPaths={xPaths}
                                xPath={xPath}
                                theme={theme}
                                relativeXPath={relativeXPath}
                                handleClick={handleClick}
                                parent={[...parent, name]}/>
                </Tag>)
        }
    )
}


const File = ({xmlContent, fileContent, fileError, relativeXPath, xmlNodes, xPaths, xPath, handleClick}) => {
    const theme = useTheme();
    const [xPathsInFile, setXPathsInFile] = useState([])

    useEffect(() => {
        if (fileContent && xmlContent && !fileError) {
            setXPathsInFile(executeXPaths(xmlContent, xPaths).map(e => e.resolved_xpath).filter(e => !['/*', ''].includes(e)))
        }
    }, [xmlContent, fileContent, fileError])

    return (
        <>
            {!!xmlNodes && <div style={{overflow: 'auto', resize: 'vertical', height: 600}}>
                <BuildNodes nodes={Object.entries(xmlNodes)}
                            theme={theme}
                            handleClick={handleClick}
                            xPath={xPath}
                            xPaths={xPathsInFile}
                            relativeXPath={relativeXPath}
                />
            </div>}
        </>
    )
}

export default File