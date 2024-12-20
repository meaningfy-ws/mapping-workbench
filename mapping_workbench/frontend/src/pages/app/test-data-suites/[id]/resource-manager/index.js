import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

import Link from "@mui/material/Link";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Breadcrumbs from "@mui/material/Breadcrumbs";

import {paths} from "src/paths";
import {Seo} from 'src/components/seo';
import {useDialog} from 'src/hooks/use-dialog';
import {useRouter} from "src/hooks/use-router";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from "src/components/router-link";
import useItemsSearch from 'src/hooks/use-items-search';
import {ItemList} from 'src/sections/app/file-manager/item-list';
import {ItemSearch} from 'src/sections/app/files-form/item-search';
import {testDataSuitesApi as sectionApi} from 'src/api/test-data-suites';
import {FileUploader} from 'src/sections/app/file-manager/file-uploader';
import {BreadcrumbsSeparator} from "src/components/breadcrumbs-separator";
import {testDataFileResourcesApi as fileResourcesApi} from 'src/api/test-data-suites/file-resources';

const Page = () => {
    const [view, setView] = useState('grid');
    const [state, setState] = useState({
        collection: {},
        items: [],
        itemsCount: 0
    });

    const uploadDialog = useDialog();
    const itemsSearch = useItemsSearch(state.items, sectionApi, ['title']);


    const router = useRouter();
    const {id} = router.query;

    usePageView();

    useEffect(() => {
        id && handleItemsGet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleItemsGet = async () => {
        try {
            const response = await sectionApi.getFileResources(id, itemsSearch.state);
            const collection = await sectionApi.getItem(id);

            setState({
                collection: collection,
                items: response.items,
                itemsCount: response.count
            });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <Seo title="App: Resource Manager"/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {`Assets Manager: ${state.collection.title}`}
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
                                href={paths.app.test_data_suites.index}
                                variant="subtitle2"
                            >
                                {sectionApi.SECTION_TITLE}
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                Assets Manager
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            onClick={uploadDialog.handleOpen}
                            startIcon={<UploadIcon/>}
                        >
                            Upload
                        </Button>
                        <Button
                            component={Link}
                            href={paths.app[sectionApi.section].resource_manager.create.replace('[id]', id)}
                            startIcon={<AddIcon/>}
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Stack spacing={{xs: 3, lg: 4}}>
                    <ItemSearch
                        onFiltersChange={e => itemsSearch.handleSearchItems([e])}
                        onSortChange={itemsSearch.handleSortChange}
                        onViewChange={setView}
                        sortBy={itemsSearch.state.sortBy}
                        sortDir={itemsSearch.state.sortDir}
                        view={view}
                    />
                    <ItemList
                        count={itemsSearch.count}
                        items={itemsSearch.pagedItems}
                        collection={state.collection}
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        page={itemsSearch.state.page}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        view={view}
                        sectionApi={sectionApi}
                        fileResourcesApi={fileResourcesApi}
                        onGetItems={handleItemsGet}
                    />
                </Stack>
            </Stack>

            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
                onGetItems={handleItemsGet}
                collectionId={id}
                sectionApi={fileResourcesApi}
            />
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
