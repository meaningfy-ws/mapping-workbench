import {useEffect, useState} from "react";

import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useDialog} from "src/hooks/use-dialog";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {SourceAndTargetTabs} from 'src/sections/app/source-and-target';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {testDataSuitesApi as sectionApi} from 'src/api/test-data-suites';
import {FileCollectionUploader} from "src/sections/app/file-manager/file-collection-uploader";
import {TestDataCollectionListTable} from "src/sections/app/file-manager/test-data-collection-list-table";

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
    const uploadDialog = useDialog()
    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['title', 'package']);

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack>
                    <SourceAndTargetTabs/>
                </Stack>
                <Stack direction='row'
                       justifyContent='space-between'>
                    <Paper>
                        <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                        value={itemsSearch.state.search[0]}/>
                    </Paper>
                    <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent='end'
                        spacing={3}
                    >
                        <Button
                            type='link'
                            onClick={uploadDialog.handleOpen}
                            startIcon={(
                                <UploadIcon/>
                            )}
                            id="import-test-data_button"
                        >
                            Import Test Data Suites
                        </Button>
                        <Button
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={(
                                <AddIcon/>
                            )}
                            variant="contained"
                            id="add_button"
                        >
                            Create Test Data Suite
                        </Button>
                    </Stack>
                </Stack>
                <TestDataCollectionListTable
                    onPageChange={itemsSearch.handlePageChange}
                    onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                    sort={itemsSearch.state.sort}
                    onSort={itemsSearch.handleSort}
                    page={itemsSearch.state.page}
                    items={itemsSearch.pagedItems}
                    itemsForced={itemsStore.force}
                    count={itemsSearch.count}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    sectionApi={sectionApi}
                    getItems={itemsStore.handleItemsGet}
                />
                <FileCollectionUploader
                    onClose={uploadDialog.handleClose}
                    open={uploadDialog.open}
                    sectionApi={sectionApi}
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
