import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

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
import {NavigationTabsWrapper} from '../../../components/navigation-tabs-wrapper';
import {FileCollectionUploader} from "../../../sections/app/file-manager/file-collection-uploader";
import UploadIcon from "@mui/icons-material/Upload";
import {useDialog} from "../../../hooks/use-dialog";

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
    const uploadDialog = useDialog()
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi, ['title']);

    usePageView();

    const onUploadEnd = () => {
        itemsStore.handleItemsGet();
        uploadDialog.handleClose();
    }

    const selectable = (item) => item.title !== sectionApi.CM_ASSERTIONS_SUITE_TITLE

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
                            type='link'
                            onClick={uploadDialog.handleOpen}
                            startIcon={(
                                <UploadIcon/>
                            )}
                            id="import-test-data_button"
                        >
                            Import {sectionApi.SECTION_TITLE}
                        </Button>
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
                    count={itemsSearch.count}
                    rowsPerPage={itemsSearch.state.rowsPerPage}
                    sort={itemsSearch.state.sort}
                    onSort={itemsSearch.handleSort}
                    sectionApi={sectionApi}
                    getItems={itemsStore.handleItemsGet}
                    selectable={selectable}
                    fileResourceApi={fileResourcesApi}
                />
                <FileCollectionUploader
                    onClose={onUploadEnd}
                    open={uploadDialog.open}
                    sectionApi={sectionApi}
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