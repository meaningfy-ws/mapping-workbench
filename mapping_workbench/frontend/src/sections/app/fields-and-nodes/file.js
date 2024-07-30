import {useEffect, useState} from "react";
import {schemaFileResourcesApi as schemaFiles} from "../../../api/schema-files/file-resources";
import {parseString} from "xml2js";
import styles from './styles/style.module.scss'

    const Attribute = ({name, value, parent}) => {
        return (
            <span onClick={() => console.log([...parent,`[${name}='${value}']`].join('/'))}
                    className={styles.attr}>
                <span className={styles['attr-name']}>{` ${name}=`}</span>
                <span className={styles['attr-value']}>{`"${value}"`}</span>
            </span>)
    }

    const PreSpaces = ({level}) => {
        return (
            <>
            {[...Array(level).keys()].map(e=> {
               return <span style={{color:'transparent'}}>{'___'}</span>
           })}
            </>
        )
    }

    const Tag = ({name, attributes, children, parent, level}) => {
       return (
           <><PreSpaces level={level}/><span className={styles['text-color']}>
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
               <span>{'>'}</span><br/>
               {children}
<               PreSpaces level={level}/>
           <span>{'</'}</span>
           <span name='close-tag'
                 className={styles.tag}
                 onClick={() => console.log('parent', [...parent, name].join('/'))}>
               {name}
           </span>
           <span>{'>'}</span><br/>
        </span></>)
    }


    const BuildObject = ({nodes, level, parent}) => {
        return nodes.map((e) => {
                const [name, value] = e
                console.log('name=>', name, 'value=>', value, typeof value)
                if(['0', '1', '2', '3'].includes(name))
                    return <BuildObject nodes={Object.entries(value).filter(en => en[0] !== '$')}
                                        key={'obj'+name}
                                        level={level}
                                        parent={[...parent, name]}/>
                if (typeof value == "string")
                    if(name !== '_')
                        return <Tag key={'tag'+name}
                                    name={name}
                                    parent={parent}
                                    level={level}>
                                <><PreSpaces level={level+1}/><span className={styles['string-content']}>{value}</span><br/></>
                            </Tag>
                    else
                        return <><PreSpaces level={level}/><span className={styles['string-content']}>{value}</span><br/></>
                // name !== '_' :
                return <Tag
                            key={'tag'+name}
                            name={name}
                            attributes={value?.['$']}
                            parent={parent}
                            level={level}>
                    <BuildObject nodes={Object.entries(value).filter(en => en[0] !== '$')}
                                 level={level + 1}
                                 parent={[...parent, name]}/>
                </Tag>
            }
        )
    }


const File = ({xmlContent}) => {
    const [xmlNodes, setXmlNodes] = useState(false)


    useEffect(() => {
        xmlContent &&
            parseString(xmlContent, {explicitArray: false}, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                } else {
                    console.log(result)
                    setXmlNodes(result)
                    // const builder = new Builder()
                    // setXmlContent(builder.buildObject(result))
                }
            });
        // if(xmlContent) {
        //     const parser = new DOMParser();
        //     const doc = parser.parseFromString(xmlContent, "application/xml");
        //     console.log(doc)
        // }
    }, [xmlContent])



    return (
        <>
            {!!xmlNodes && <BuildObject nodes={Object.entries(xmlNodes)}
                                        level={0}
                                        parent={[]}/>}
        </>
    )
}

export default File