import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from "@mui/material/Divider";
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {ontologyTermsApi} from 'src/api/ontology-terms'
import {fieldsRegistryApi} from "src/api/fields-registry";
import useItemsSearch from 'src/hooks/use-items-search';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {ListTable} from 'src/sections/app/conceptual-mapping-rule/develop/list-table';
import {conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import AddEditDrawer from "src/sections/app/conceptual-mapping-rule/develop/add-edit-drawer";

const searchColumns = [
    "source_structural_element_sdk_element_id",
    "source_structural_element_absolute_xpath",
    "xpath_condition",
    "min_sdk_version",
    "max_sdk_version",
    "target_class_path",
    "target_property_path"
]

export const Page = () => {
    const [state, setState] = useState({})
    const [ontologyFragments, setOntologyFragments] = useState([])

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

    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, searchColumns);

    const [isProjectDataReady, setIsProjectDataReady] = useState(false);

    const [projectSourceStructuralElements, setProjectSourceStructuralElements] = useState([]);

    useEffect(() => {
        fieldsRegistryApi.getStructuralElementsForSelector()
            .then(res => {
                setProjectSourceStructuralElements(res);
                setIsProjectDataReady(true);
            })
    }, [])

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

    const handleDelete = (item) => {
        sectionApi.deleteItem(item._id)
            .finally(() => afterItemProcess(null))
    }

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
                    <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                    value={itemsSearch.state.search[0]}
                                    placeholder='Search Terms'/>
                    <Divider/>
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        onSort={itemsSearch.handleSort}
                        sort={itemsSearch.state.sort}
                        page={itemsSearch.state.page}
                        items={itemsSearch.pagedItems}
                        count={itemsSearch.count}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
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
        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
