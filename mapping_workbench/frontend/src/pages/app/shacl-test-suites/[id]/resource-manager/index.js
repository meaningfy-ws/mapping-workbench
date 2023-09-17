import {useCallback, useEffect, useMemo, useState} from 'react';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import Plus from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {shaclTestSuitesApi as sectionApi} from 'src/api/shacl-test-suites';
import {shaclTestFileResourcesApi as fileResourcesApi} from 'src/api/shacl-test-suites/file-resources';
import {Seo} from 'src/components/seo';
import {useDialog} from 'src/hooks/use-dialog';
import {useMounted} from 'src/hooks/use-mounted';
import {usePageView} from 'src/hooks/use-page-view';
import {useSettings} from 'src/hooks/use-settings';
import {Layout as AppLayout} from 'src/layouts/app';
import {FileUploader} from 'src/sections/app/file-manager/file-uploader';
import {ItemDrawer} from 'src/sections/app/file-manager/item-drawer';
import {ItemList} from 'src/sections/app/file-manager/item-list';
import {ItemSearch} from 'src/sections/app/file-manager/item-search';
import {useRouter} from "src/hooks/use-router";
import {paths} from "../../../../../paths";

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            query: undefined
        },
        page: 0,
        rowsPerPage: 9,
        sortBy: 'createdAt',
        sortDir: 'desc'
    });

    const handleFiltersChange = useCallback((filters) => {
        setState((prevState) => ({
            ...prevState,
            filters
        }));
    }, []);

    const handleSortChange = useCallback((sortDir) => {
        setState((prevState) => ({
            ...prevState,
            sortDir
        }));
    }, []);

    const handlePageChange = useCallback((event, page) => {
        setState((prevState) => ({
            ...prevState,
            page
        }));
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setState((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }, []);

    return {
        handleFiltersChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};

const useItemsStore = (id, searchState) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        collection: {},
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const response = await sectionApi.getFileResources(id, searchState);
            const collection = await sectionApi.getItem(id);

            if (isMounted()) {
                setState({
                    collection: collection,
                    items: response.items,
                    itemsCount: response.count
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [searchState, isMounted]);

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};


const useCurrentItem = (items, itemId) => {
    return useMemo(() => {
        if (!itemId) {
            return undefined;
        }

        return items.find((item) => item.id === itemId);
    }, [items, itemId]);
};

const Page = () => {
    const router = useRouter();
    if (!router.isReady) return;

    const {id} = router.query;

    if (!id) {
        return;
    }

    const handleCreate = useCallback(async () => {
        router.push({
            pathname: paths.app[sectionApi.section].resource_manager.create,
            query: {id: id}
        });

    }, [router, sectionApi]);

    const settings = useSettings();
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(id, itemsSearch.state);
    const [view, setView] = useState('grid');
    const uploadDialog = useDialog();
    const detailsDialog = useDialog();
    const currentItem = useCurrentItem(itemsStore.items, detailsDialog.data);

    usePageView();

    return (
        <>
            <Seo title="App: Resource Manager"/>

            <Grid
                container
                spacing={{
                    xs: 3,
                    lg: 4
                }}
            >
                <Grid xs={12}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={4}
                    >
                        <div>
                            <Typography variant="h4">
                                {itemsStore.collection.title}
                            </Typography>
                            <Typography variant="h5">
                                Resource Manager
                            </Typography>
                        </div>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                            <Button
                                onClick={uploadDialog.handleOpen}
                                startIcon={(
                                    <SvgIcon>
                                        <Upload01Icon/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Upload
                            </Button>
                            <Button
                                onClick={handleCreate}
                                startIcon={(
                                    <SvgIcon>
                                        <Plus/>
                                    </SvgIcon>
                                )}
                                variant="contained"
                            >
                                Add
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid
                    xs={12}
                    md={12}
                >
                    <Stack
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}
                    >
                        <ItemSearch
                            onFiltersChange={itemsSearch.handleFiltersChange}
                            onSortChange={itemsSearch.handleSortChange}
                            onViewChange={setView}
                            sortBy={itemsSearch.state.sortBy}
                            sortDir={itemsSearch.state.sortDir}
                            view={view}
                        />
                        <ItemList
                            count={itemsStore.itemsCount}
                            items={itemsStore.items}
                            collection={itemsStore.collection}
                            onPageChange={itemsSearch.handlePageChange}
                            onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                            page={itemsSearch.state.page}
                            rowsPerPage={itemsSearch.state.rowsPerPage}
                            view={view}
                            sectionApi={sectionApi}
                            fileResourcesApi={fileResourcesApi}
                        />
                    </Stack>
                </Grid>
            </Grid>

            <ItemDrawer
                item={currentItem}
                onClose={detailsDialog.handleClose}
                open={detailsDialog.open}
            />
            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
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
