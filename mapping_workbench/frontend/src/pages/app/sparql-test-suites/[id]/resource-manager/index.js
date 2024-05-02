import {useEffect, useMemo, useState} from 'react';

import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import Plus from '@untitled-ui/icons-react/build/esm/Plus';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {sparqlTestSuitesApi as sectionApi} from 'src/api/sparql-test-suites';
import {sparqlTestFileResourcesApi as fileResourcesApi} from 'src/api/sparql-test-suites/file-resources';
import {Seo} from 'src/components/seo';
import {useDialog} from 'src/hooks/use-dialog';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {FileUploader} from 'src/sections/app/file-manager/file-uploader';
import {ItemDrawer} from 'src/sections/app/file-manager/item-drawer';
import {ItemList} from 'src/sections/app/file-manager/item-list';
import {ItemSearch} from 'src/sections/app/file-manager/item-search';
import {useRouter} from "src/hooks/use-router";
import {paths} from "../../../../../paths";
import Link from "next/link";

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            query: undefined
        },
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE,
        sortBy: 'createdAt',
        sortDir: 'desc'
    });

    const handleFiltersChange = filters => {
        setState(prevState => ({
            ...prevState,
            filters
        }));
    }

    const handleSortChange = sortDir => {
        setState(prevState => ({
            ...prevState,
            sortDir
        }));
    }

    const handlePageChange = (event, page) => {
        setState(prevState => ({
            ...prevState,
            page
        }));
    }

    const handleRowsPerPageChange = event => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }

    return {
        handleFiltersChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        state
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
    const [view, setView] = useState('grid');
    const [state, setState] = useState({
        collection: {},
        items: [],
        itemsCount: 0
    });

    const uploadDialog = useDialog();
    const detailsDialog = useDialog();
    const itemsSearch = useItemsSearch();

    const currentItem = useCurrentItem(state.items, detailsDialog.data);

    const router = useRouter();
    const {id} = router.query;

    usePageView();

    useEffect(() => {
        id && handleItemsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemsSearch.state, id]);

    const handleItemsGet = async () => {
        try {
            const response = await sectionApi.getFileResources(id, itemsSearch);
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
                                {state.collection.title}
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
                                component={Link}
                                href={paths.app[sectionApi.section].resource_manager.create.replace('[id]', id)}
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
                            count={state.itemsCount}
                            items={state.items}
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
                onGetItems={handleItemsGet}
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
