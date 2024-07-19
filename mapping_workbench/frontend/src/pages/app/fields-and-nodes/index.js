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
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {useState} from "react";
import Input from "@mui/material/Input";

const Page = () => {

    const [nodeValue,setNodeValue] = useState('')

    const collectNodeText = (node) => {
        if(node?.children && ['token','tag'].every(e =>node.properties?.className.includes(e)) && !['punctuation','attr-name','attr-value'].some(e => node.properties?.className.includes(e)) )
            return node?.children.map(e=>e.value).join('').replace(' ','')

        if(node?.children)
            return node.children.map(e=>collectNodeText(e))
        // return node.value
    }

    const listOfNodes = ['ContractNotice','UBLExtension']
    const renderRow = (rows, css, firstLevel) => {
        return rows.map((node, i) => {
            const nodeCss = Object.assign({}, ...node.properties?.className.map(e=>css[e]).filter(e => e) ?? [])
            return <span key={node.properties?.key ?? i}
                         className={node.properties?.className?.join(' ')}
                         // onClick={node.properties?.onClick}
                         onClick={() => {
                             if(firstLevel) {
                                 const out = collectNodeText(node)?.flat()?.join('')
                                 const double = [out.slice(0,out.length/2),out.slice(out.length/2,out.length)]
                                 if(double[0]===double[1])
                                     setNodeValue(double[0])
                                 else setNodeValue(out)
                             }
                         }}
                         style={  {...nodeCss, ...node.properties?.style, backgroundColor:listOfNodes.includes(node.value) ? 'yellow' : ''}}>
                {node.children ? renderRow(node.children, css, false) : node.value
                }
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
                    <SyntaxHighlighter
                        language="xml"
                        // wrapLines
                        showLineNumbers={true}

                          renderer={({ rows, stylesheet, useInlineStyles }) => {
                              console.log(rows)
                            return renderRow(rows, stylesheet, true);
                          }}
                        lineProps={(lineNumber) =>
                            ({
                            style: { display: "block", cursor: "pointer" },
                            onClick() {
                              alert(`Line Number Clicked: ${lineNumber}`);
                            },
                            onHover() {
                                () => console.log(lineNumber)
                            }
                          })
                        }
                          >
                        {XMLData}
                    </SyntaxHighlighter>
                </Card>
                <Input value={nodeValue}/>
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
