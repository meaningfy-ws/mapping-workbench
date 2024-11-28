import {DataGrid} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useDialog} from 'src/hooks/use-dialog';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {ontologyTermsApi} from 'src/api/ontology-terms'
import {fieldsRegistryApi} from "src/api/fields-registry";
import {useHighlighterTheme} from 'src/hooks/use-highlighter-theme';
import ConfirmDialog from 'src/components/app/dialog/confirm-dialog';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import {XqueryDialog} from 'src/sections/app/conceptual-mapping-rule/develop/xquery-dialog';
import AddEditDrawer from "src/sections/app/conceptual-mapping-rule/develop/add-edit-drawer";


export const Page = () => {
    const [state, setState] = useState({})
    const [ontologyFragments, setOntologyFragments] = useState([])
    const syntaxHighlighterTheme = useHighlighterTheme()

    const [itemsStore, setItemsStore] = useState({
        items: [],
        itemsCount: 0
    });

    useEffect(() => {
        handleItemsGet();
        handleGetOntologyFragments();
    }, []);

    const handleItemsGet = () => {
        sectionApi.getItems({rowsPerPage: -1})
            .then(res => setItemsStore({items: res.items, itemsCount: res.count}))
            .catch(err => console.warn(err))
    }

    const handleGetOntologyFragments = () => {
        ontologyTermsApi.getItems({rowsPerPage: -1})
            .then(res => {
                setOntologyFragments(res.items.filter(e => ['CLASS', 'PROPERTY', 'DATA_TYPE'].includes(e.type))
                    .map(e => ({id: e._id, title: e.short_term, type: e.type})));
            })
    }

    const [isProjectDataReady, setIsProjectDataReady] = useState(false);

    const [projectSourceStructuralElements, setProjectSourceStructuralElements] = useState([]);

    useEffect(() => {
        fieldsRegistryApi.getStructuralElementsForSelector()
            .then(res => {
                setProjectSourceStructuralElements(res);
                setIsProjectDataReady(true);
            })
    }, [])

    const xpathConditionDialog = useDialog()

    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!isProjectDataReady) return null;


    const handleEdit = (item) => {
        setState(e => ({...e, openDrawer: true, item}))
    }

    const handleAdd = () => {
        setState(e => ({...e, openDrawer: true, item: null}))
    }

    const handleCloseDrawer = () => {
        setState(e => ({...e, openDrawer: false}))
    }

    const afterItemProcess = (item) => {
        handleItemsGet()
    }

    const handleDelete = (id) => {
        sectionApi.deleteItem(id)
            .finally(() => afterItemProcess(null))
    }


    const columns = [
        {
            field: 'source_structural_element_sdk_element_id', headerName: 'Field Id', flex: 1,
        },
        {
            field: 'source_structural_element_absolute_xpath', headerName: 'Absolute XPath', width: 160, height: 'auto',
            renderCell: ({row}) => <SyntaxHighlighter language="xquery"
                                                      wrapLines
                                                      style={syntaxHighlighterTheme}
                                                      lineProps={{
                                                          style: {
                                                              wordBreak: 'break-all',
                                                              whiteSpace: 'pre-wrap'
                                                          }
                                                      }}>
                {row.source_structural_element_absolute_xpath}
            </SyntaxHighlighter>
        },
        {
            field: 'created_at', headerName: 'Created', width: 90,
            renderCell: ({row}) =>
                row.xpath_condition &&
                <Button variant="text"
                        type='link'
                        onClick={() => xpathConditionDialog.handleOpen(row.xpath_condition)}>XQuery</Button>

        },
        {
            field: 'min_sdk_version', headerName: 'Min XSD', width: 90
        },
        {
            field: 'max_sdk_version', headerName: 'Max XSD', width: 90
        },
        {
            field: 'target_class_path', headerName: 'Ontology Class Path', width: 160
        },
        {
            field: 'target_property_path', headerName: 'Ontology Property Path', width: 160
        },
        {
            field: 'id',
            headerName: 'Action',
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: ({id, row}) => <>
                <Button id="edit_button"
                        variant="text"
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(row)}
                >
                    Edit
                </Button>
                <Button id="delete_button"
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => setConfirmOpen(true)}
                        sx={{
                            whiteSpace: "nowrap"
                        }}
                >
                    Delete
                </Button>
                <ConfirmDialog title="Delete It?"
                               open={confirmOpen}
                               setOpen={setConfirmOpen}
                               onConfirm={() => handleDelete(id)}
                >
                    Are you sure you want to delete it?
                </ConfirmDialog>
            </>
        },
    ]

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE}`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            Develop {sectionApi.SECTION_TITLE}
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
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                Develop {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            id="add_button"
                            startIcon={(
                                <SvgIcon>
                                    <AddIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                            onClick={handleAdd}
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <DataGrid getRowHeight={() => 'auto'}
                              getRowId={row => row._id}
                              rows={itemsStore.items}
                              columns={columns}
                              slotProps={{
                                  pagination: {
                                      showFirstButton: true,
                                      showLastButton: true,
                                  }
                              }}
                              initialState={{
                                  pagination: {
                                      paginationModel: {
                                          pageSize: sectionApi.DEFAULT_ROWS_PER_PAGE,
                                      },
                                  },
                              }}
                              pageSizeOptions={[5, 10, 25, 100]}
                              disableRowSelectionOnClick
                    />
                </Card>
                <AddEditDrawer open={state.openDrawer}
                               onClose={handleCloseDrawer}
                               item={state.item}
                               sectionApi={sectionApi}
                               structuralElements={projectSourceStructuralElements}
                               afterItemSave={afterItemProcess}
                               ontologyFragments={ontologyFragments}
                />
            </Stack>
            <XqueryDialog open={xpathConditionDialog.open}
                          handleClose={xpathConditionDialog.handleClose}
                          item={xpathConditionDialog.data}/>
        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
