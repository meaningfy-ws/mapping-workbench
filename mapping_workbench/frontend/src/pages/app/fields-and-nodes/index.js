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

const Page = () => {

    const listOfNodes = ['ContractNotice','UBLExtension']
    const renderRow = (rows, css, level) => {
        return rows.map((node, i) => {
            const nodeCss = Object.assign({}, ...node.properties?.className.map(e=>css[e]).filter(e => e) ?? [])
            return <span key={node.properties?.key ?? i}
                         className={node.properties?.className?.join(' ')}
                         onClick={node.properties?.onClick}
                // onClick={() => level ===1 && console.log(node)}
                         style={  {...nodeCss, ...node.properties?.style, backgroundColor:listOfNodes.includes(node.value) ? 'yellow' : ''}}>
                {node.children ? renderRow(node.children, css, level++) : node.value
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
                            return renderRow(rows, stylesheet, 1);
                          }}
                        lineProps={(lineNumber) => ({
                            style: { display: "block", cursor: "pointer" },
                            onClick() {
                              alert(`Line Number Clicked: ${lineNumber}`);
                            }
                          })}
                          >
                        {XMLData}
                    </SyntaxHighlighter>
                </Card>
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
