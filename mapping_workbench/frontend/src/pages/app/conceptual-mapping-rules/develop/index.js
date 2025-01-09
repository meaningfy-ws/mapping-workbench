import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {ontologyTermsApi} from 'src/api/ontology-terms'
import {fieldsRegistryApi} from "src/api/fields-registry";
import useItemsSearch from 'src/hooks/use-items-search';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {ListTable} from 'src/sections/app/conceptual-mapping-rule/develop/list-table';
import {conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import AddEditDrawer from "src/sections/app/conceptual-mapping-rule/develop/add-edit-drawer";
import {ConceptualMappingTabs} from 'src/sections/app/conceptual-mapping-rule/conceptual-mapping-tabs';
import {NavigationTabsWrapper} from '../../../../components/navigation-tabs-wrapper';

const SEARCH_COLUMNS = [
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

    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, SEARCH_COLUMNS);

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
            <NavigationTabsWrapper>
                <ConceptualMappingTabs/>
            </NavigationTabsWrapper>
            <Stack spacing={4}
                   mt={5}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Paper>
                        <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                        value={itemsSearch.state.search[0]}
                                        placeholder='Search Terms'/>
                    </Paper>
                    <Button
                        id="add_button"
                        startIcon={<AddIcon/>}
                        onClick={handleAdd}
                    >
                        Add
                    </Button>
                </Stack>
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
