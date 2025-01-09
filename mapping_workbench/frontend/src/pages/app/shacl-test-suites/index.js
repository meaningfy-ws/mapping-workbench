import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {QualityControlTabs} from 'src/sections/app/quality-control';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {shaclTestSuitesApi as sectionApi} from 'src/api/shacl-test-suites';
import {FileCollectionListTable} from 'src/sections/app/file-manager/file-collection-list-table';
import {shaclTestFileResourcesApi as fileResourceApi} from 'src/api/shacl-test-suites/file-resources'
import {NavigationTabsWrapper} from '../../../components/navigation-tabs-wrapper';

const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
        force: 0
    });

    const handleItemsGet = (force = 0) => {
        sectionApi.getItems()
            .then(res =>
                setState({
                    items: res.items,
                    itemsCount: res.count,
                    force: force
                }))
            .catch(err => console.error(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        handleItemsGet,
        ...state
    };
};

const Page = () => {
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['title']);

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <NavigationTabsWrapper>
                <QualityControlTabs/>
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
                                        value={itemsSearch.state.search[0]}/>
                    </Paper>
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
                <FileCollectionListTable
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    page={itemsSearch.state.page}
                    items={itemsSearch.pagedItems}
                    itemsForced={itemsStore.force}
                    count={itemsStore.itemsCount}
                    sort={itemsSearch.state.sort}
                    onSort={itemsSearch.handleSort}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    sectionApi={sectionApi}
                    fileResourceApi={fileResourceApi}
                    getItems={itemsStore.handleItemsGet}
                />
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
