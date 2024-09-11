import {useEffect, useState} from "react";
import classNames from "classnames/bind";
import styles from './styles/style.module.scss'
import {useTheme} from "@mui/material/styles";
import {executeXPaths} from "./utils";

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
    if (shiftedParent.length)
        shiftedParent.shift()
    const nodeXPath = ['/*', ...shiftedParent, name].join('/')
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


const BuildNodes = ({nodes, level = 0, parent = [], xPath, xPaths, relativeXPath, handleClick, theme}) => {
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
            {!!xmlNodes && <div className={cx('container')}>
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