import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {QualityControlTabs} from 'src/sections/app/quality-control';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {sparqlTestSuitesApi as sectionApi} from 'src/api/sparql-test-suites';
import {FileCollectionListTable} from 'src/sections/app/file-manager/file-collection-list-table';
import {sparqlTestFileResourcesApi as fileResourcesApi} from "src/api/sparql-test-suites/file-resources";

const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
        force: 0
    });

    const handleItemsGet = (force = 0) => {
        sectionApi.getItems()
            .then(res => setState({
                items: res.items,
                itemsCount: res.count,
                force: force
            }))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        handleItemsGet();
    }, []);

    return {
        handleItemsGet,
        ...state
    };
};

const Page = () => {
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['title']);

    usePageView();

    const selectable = (item) => item.title !== sectionApi.CM_ASSERTIONS_SUITE_TITLE

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <QualityControlTabs/>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            id="add_button"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={<AddIcon/>}
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                    value={itemsSearch.state.search[0]}/>
                    <Divider/>
                    <FileCollectionListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        page={itemsSearch.state.page}
                        items={itemsSearch.pagedItems}
                        itemsForced={itemsStore.force}
                        count={itemsStore.itemsCount}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sort={itemsSearch.state.sort}
                        onSort={itemsSearch.handleSort}
                        sectionApi={sectionApi}
                        getItems={itemsStore.handleItemsGet}
                        selectable={selectable}
                        fileResourceApi={fileResourcesApi}
                    />
                </Card>
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