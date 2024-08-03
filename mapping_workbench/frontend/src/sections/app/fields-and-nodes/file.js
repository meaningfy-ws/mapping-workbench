import {useEffect, useState} from "react";
import {parseString} from "xml2js";
import styles from './styles/style.module.scss'
import Alert from "@mui/material/Alert";

    const MARGIN = 14
    const ATTRIBUTE_SIGN = '$'
    const NAME_SIGH = '_'

    const Attribute = ({ name, value, parent }) => {
        return (
            <span onClick={() => console.log([...parent, `[${name}='${value}']`].join('/'))}
                  className={styles.attr}>
                <span className={styles['attr-name']}>{` ${name}=`}</span>
                <span>{'"'}</span>
                    <span className={styles['attr-value']}>{value}</span>
                <span>{'"'}</span>
            </span>)
    }


const Tag = ({name, attributes, children, parent, level, isField}) => {
       return (
           <span style={{marginLeft: level * MARGIN}}
                       className={styles['text-color']}>
               <span>{'<'}</span>
               <span name='tag'
                     className={styles.tag}
                     onClick={() => console.log('parent', [...parent, name].join('/'))}>
                   {name}
               </span>
               {attributes && <span name={'attributes'}>{Object.entries(attributes).map(([name, value]) =>
                   <Attribute key={name}
                              name={name}
                              value={value}
                              parent={parent}/>)}
           </span>}
               <span>{'>'}</span>
               {!isField && <br/>}
               {children}
               {!isField && <br/>}
           <span style={{marginLeft: isField ? 0 : level * MARGIN}} >{'</'}</span>
           <span name='close-tag'
                 className={styles.tag}
                 onClick={() => console.log('parent', [...parent, name].join('/'))}>
               {name}
           </span>
           <span>{'>'}</span>
               <br/>
               {/*{!isField && <br/>}*/}
        </span>)
    }


    const BuildObject = ({nodes, level, parent}) => {
        return nodes.map((e) => {
                const [name, value] = e
                // console.log('name=>', name, 'value=>', value, typeof value)
                if(['0', '1', '2', '3'].includes(name))
                    return <BuildObject nodes={Object.entries(value).filter(en => en[0] !== ATTRIBUTE_SIGN)}
                                        key={'obj'+name}
                                        level={level}
                                        parent={[...parent, name]}/>
                if (typeof value == "string")
                    if(name !== NAME_SIGH)
                        return <Tag key={'tag'+name}
                                    name={name}
                                    isField
                                    parent={parent}
                                    level={level}>
                                <>
                                    {/*<span style={{marginLeft: level*MARGIN}}*/}
                                    <span className={styles['string-content']}>
                                        {value}
                                    </span>
                                    {/*<br/>*/}
                                </>
                            </Tag>
                    else
                        return <span key={name}>
                                <span
                                    // style={{marginLeft: (level+1)*MARGIN}}
                                        className={styles['string-content']}>
                                        {value}
                                </span>
                                {/*<br/>*/}
                            </span>
                return <Tag
                            key={'tag' + name}
                            name={name}
                            attributes={value?.[ATTRIBUTE_SIGN]}
                            parent={parent}
                            isField={Object.entries(value).some(e => e[0] === NAME_SIGH)}
                            level={level}>
                    <BuildObject nodes={Object.entries(value).filter(en => en[0] !== ATTRIBUTE_SIGN)}
                                 level={level + 1}
                                 parent={[...parent, name]}/>
                </Tag>
            }
        )
    }


const File = ({xmlContent}) => {
    const [xmlNodes, setXmlNodes] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(false)
        xmlContent &&
            parseString(xmlContent, {explicitArray: false}, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                    setError(err)
                } else {
                    console.log(result)
                    setXmlNodes(result)
                    // const builder = new Builder()
                    // setXmlContent(builder.buildObject(result))
                }
            });
        if(xmlContent) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlContent, "application/xml");
            console.log(doc)
            // const res = doc.evaluate('/*/cac:AdditionalDocumentReference',doc,null,XPathResult.ANY_TYPE,null)
            // console.log(res)

            // const evaluator = new XPathEvaluator()
            // const expresion = evaluator.createExpression('/*/cac:AdditionalDocumentReference')
            // const res = expresion.evaluate(doc,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)
            // document.querySelector("output").textContent = res.snapshotLength;
            // const ex = doc.evaluate("/cbc\\:WebsiteURI", doc, null, XPathResult.ANY_TYPE)
            // console.log(ex)
        }
    }, [xmlContent])



    return (
        <>
            {error && <Alert severity="error">{error.message}</Alert>}
            {!!xmlNodes && !error && <BuildObject nodes={Object.entries(xmlNodes)}
                                        level={0}
                                        parent={[]}/>}
        </>
    )
}

export default File