import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import {RouterLink} from 'src/components/router-link';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import XMLData from 'cn_81'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import {useEffect, useState} from "react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
// import 'codemirror/mode/xml/xml';
// import 'codemirror/theme/neat.css';
// import 'codemirror/mode/javascript/javascript.js';
                      // import { xml } from '@codemirror/lang-xml'
// require('codemirror/mode/xml/xml');

const Page = () => {

    // const language = () => [import('codemirror/mode/xml/xml')];

    const [load,setLoad] = useState(false)

    useEffect(() => {
        dinamycImport()
            .then(() => setLoad(true))
    }, []);


    const dinamycImport = async ()  => {
        await import('codemirror/mode/xml/xml')
    }

    const [listOfNodes, setListOfNodes] = useState(['ContractNotice','UBLExtension'])
    const [nodeValue,setNodeValue] = useState('')
    const [hoveredLine, setHoveredLine] = useState(-1)


    const collectNodeText = (node) => {
        if(node?.children && ['token','tag'].every(e =>node.properties?.className.includes(e)) && !['punctuation','attr-name','attr-value'].some(e => node.properties?.className.includes(e)) )
            return node?.children.map(e=>e.value).join('').replace(' ','')

        if(node?.children)
            return node.children.map(e=>collectNodeText(e))
        // return node.value
    }

    const renderRow = (rows, css, highlight) => {
        return rows.map((node, i) => {
            const nodeCss = Object.assign({}, ...node.properties?.className.map(e=>css[e]).filter(e => e) ?? [])
            const isTagNode = ['token','tag'].every(e =>node.properties?.className.includes(e))
                && !['punctuation','attr-name','attr-value'].some(e => node.properties?.className.includes(e))
                && node.children?.[0]?.value !== ' '
            return <span key={node.properties?.key ?? i}
                         className={node.properties?.className?.join(' ')}
                         // onClick={node.properties?.onClick}
                         style={  {...nodeCss, ...node.properties?.style, backgroundColor: isTagNode && highlight ? 'yellow' : ''}}
                    >
                        {node.children ? renderRow(node.children, css, false) : node.value}
                    </span>
        });
    }


    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {sectionApi.SECTION_TITLE}
                        </Typography>
                        <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={paths.index}
                                variant="subtitle2"
                            >
                                App
                            </Link>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={paths.app[sectionApi.section].index}
                                variant="subtitle2"
                            >
                                {sectionApi.SECTION_TITLE}
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                List
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                    </Stack>

                </Stack>
                <Card>
                    {load &&
                   <CodeMirror
                      value={XMLData}
                      options={{
                        mode: 'xml',
                        theme: 'material',
                        lineNumbers: true,
                          disabled:true,
                      }}
                    />}
                </Card>
                <Input value={nodeValue}/><Button onClick={() => setListOfNodes(e=>([...e, nodeValue]))}>Save</Button>
            </Stack>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
