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
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {TechnicalMappingsTabs} from 'src/sections/app/technical-mappings';
import {resourceFilesApi} from 'src/api/resource-collections/file-resources';
import {resourceCollectionsApi as sectionApi} from 'src/api/resource-collections';
import {FileCollectionListTable} from 'src/sections/app/file-manager/file-collection-list-table';
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
                    force
                }))
            .catch(err => console.warn(err))
    }


    useEffect(() => {
            handleItemsGet()
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
                <TechnicalMappingsTabs/>
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
                <FileCollectionListTable onPageChange={itemsSearch.handlePageChange}
                                         onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                                         page={itemsSearch.state.page}
                                         items={itemsSearch.pagedItems}
                                         itemsForced={itemsStore.force}
                                         sort={itemsSearch.state.sort}
                                         onSort={itemsSearch.handleSort}
                                         count={itemsSearch.count}
                                         rowsPerPage={itemsSearch.state.rowsPerPage}
                                         sectionApi={sectionApi}
                                         fileResourceApi={resourceFilesApi}
                                         getItems={itemsStore.handleItemsGet}
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
