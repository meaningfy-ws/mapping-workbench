import {useEffect, useState} from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import {parseString, Builder} from "xml2js";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import {Layout as AppLayout} from 'src/layouts/app';
import {schemaFileResourcesApi as schemaFiles} from 'src/api/schema-files/file-resources'
import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'
import CircularProgress from "@mui/material/CircularProgress";
import {AlertTitle, Alert} from "@mui/material";


// import styles from './style.scss'


    const Attribute = ({name, value, parent}) => {
        return <span onClick={() => console.log([...parent,`[${name}='${value}']`].join('/'))}><span style={{color:'green'}}>{` ${name}=`}</span><span style={{color:'blue'}}>{`"${value}"`}</span></span>
    }

    const Tag = ({name, attributes, children, parent}) => {
        console.log(name)
        attributes && console.log('attributes',Object.entries(attributes))
       return <span>
           <span>{'<'}</span>
           <span style={{color:'red'}}
                onClick={() => console.log('parent',[...parent,name].join('/'))}>{name}</span>
           {attributes && <span name={'attributes'}>{Object.entries(attributes).map(([name,value]) =>
               <Attribute key={name}
                          name={name}
                          value={value}
                          parent={parent}/>)}
           </span>}
           <span>{'>'}</span>
           {children}
           <span>{'</'}</span>
           <span>{name}</span>
           <span>{'>'}</span>
        </span>
    }


    const BuildObject = ({nodes, level, parent}) => {
        // console.log(Object.entries(nodes))

        const nd = nodes
        console.log('level',level)
        console.log('nodeEntries',nd)
        //
        // for(let a in nodes) {
        //     console.log(a)
        //     console.log(nodes[a])
        // }

        // const mapNodes = nodes.map(e=> {
        //     console.log(e)
        // })
        //     console.log(Object.)
        // const node = Object.entries(nodes)
        // const subnodes = Object.values(nodes)
        // const [node1] =Object.entries(nodes)
        // const [node,subnode] = node1
        // console.log(node,subnode)


        // console.log(Object.entries(subnode))
        // const [nd,snd] = node
        // console.log(nd,snd)
        // console.log(Object.entries(snd))

        // return
        console.log(nd.map(e => {
            console.log(e)
            console.log(Object.entries(e[1]))
            const filtred = Object.entries(e[1]).filter(en => {
                console.log(en[0])
                return !['$','_'].includes(en[0])
            })
            console.log(filtred)
        }
        ))
        console.log(parent)
        // let spaces/ = ''
        //   const spaces =  [ ...Array(10) ].reduce((acc, crr) => crr + '123','');

        // console.log(spaces)

        return nd.map(e=>
            {
        console.log(typeof e[1])
               return  typeof e[1] == "object" ?
                <><br/><Tag name={e[0]} attributes={e?.[1]?.['$']} parent={parent}>
                <BuildObject nodes={Object.entries(e[1]).filter(en => en[0]!=='$')} level={level+1} parent={[...parent, e[0]]} />
                    </Tag>
                </>
                : e[1]
            }
        )

        return <div>
            {`<${'node'}>`}
        </div>
    }


const Page = () => {
    const [files, setFiles] = useState([])
    const [xmlContent, setXmlContent] = useState('')
    const [xmlNodes, setXmlNodes] = useState(false)

    useEffect(() => {
        schemaFiles.getItems({})
            .then(res => setFiles(res))
            .catch(err => console.error(err))

        // fieldsRegistry.getXpathsList()
        //     .then(res => {
        //         console.log(res)
        //         setXPaths(res)
        //     })
        //     .catch(err => console.error(err))
    }, [])


    useEffect(() => {
        if(files.length) {
            parseString(files[1].content, {explicitArray: false}, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                } else {
                    console.log(result)
                    setXmlNodes(result)
                    // const builder = new Builder()
                    // setXmlContent(builder.buildObject(result))
                }
            });
        }
    }, [files])



    return (
        <>
            {!!xmlNodes && <BuildObject nodes={Object.entries(xmlNodes)} level={1} parent={[]}/>}
        </>
    )
}

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
