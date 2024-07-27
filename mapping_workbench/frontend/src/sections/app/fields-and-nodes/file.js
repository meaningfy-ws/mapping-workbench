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

    const Tag = ({name, attributes, children, parent}) => {
       return (
           <span className={styles['text-color']}>
               <span>{'<'}</span>
               <span name='tag'
                     className={styles.tag}
                    onClick={() => console.log('parent',[...parent,name].join('/'))}>
                   {name}
               </span>
               {attributes && <span name={'attributes'}>{Object.entries(attributes).map(([name,value]) =>
                   <Attribute key={name}
                              name={name}
                              value={value}
                              parent={parent}/>)}
           </span>}
           <span>{'>'}</span>
               {children}
           <span>{'</'}</span>
           <span name='close-tag'
                 className={styles.tag}
                 onClick={() => console.log('parent',[...parent,name].join('/'))}>
               {name}
           </span>
           <span>{'>'}</span>
        </span>)
    }


    const BuildObject = ({nodes, level, parent}) => {
        return nodes.map(e =>
            typeof e[1] == "object" ?
                <><br/><Tag name={e[0]}
                            attributes={e?.[1]?.['$']}
                            parent={parent}>
                <BuildObject nodes={Object.entries(e[1]).filter(en => en[0]!=='$')} level={level+1} parent={[...parent, e[0]]} />
                    </Tag>
                </>
                : <span className={styles['string-content']}>{e[1]}</span>
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
    }, [xmlContent])



    return (
        <>
            {!!xmlNodes && <BuildObject nodes={Object.entries(xmlNodes)}
                                        level={1}
                                        parent={[]}/>}
        </>
    )
}

export default File