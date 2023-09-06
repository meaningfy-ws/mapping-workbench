import {useCallback, useEffect, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import {resourceCollectionsApi as sectionApi} from 'src/api/resource-collections';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {useMounted} from 'src/hooks/use-mounted';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {FileCollectionListSearch} from 'src/sections/app/file-manager/file-collection-list-search';
import {FileCollectionListTable} from 'src/sections/app/file-manager/file-collection-list-table';


const mockDataPackages = {
    title: "F03",
    description: "Des03",
    formType: "35",
    minDate: "01/06/2023",
    maxDate: "23/06/2023",
    minVersion: "R2.08.55",
    maxVersion: "R2.09.66",
};

const collectionsID = [];

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        page: 0,
        rowsPerPage: 5
    });

    const handleFiltersChange = useCallback((filters) => {
        setState((prevState) => ({
            ...prevState,
            filters
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
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};

const useItemsStore = (searchState) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });
    const [stateFile, setStateFile] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = useCallback(async () => {
        try {
            const response = await sectionApi.getItems(searchState);

            if (isMounted()) {
                setState({
                    items: response.items,
                    itemsCount: response.count
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [searchState, isMounted]);

    const handleItemsGetFiles = useCallback(async () => {
        try {
            const response2 = await sectionApi.getFileResources(id);
            //const collection = await sectionApi.getItem(id);


            //console.log("response2: ", response);
            //console.log("collection: ", collection);


            setStateFile({
                //collection: collection,
                itemsF: response2.items,
                itemsFCount: response2.count
            });

        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
            handleItemsGet().then(response => {
                console.log("RESPONSE: ", response);
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};

///////////////////////////////////////////////////

const useItemsStoreFiles = (id) => {

    const [stateFile, setStateFile] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGetFiles = useCallback(async () => {
        try {
            const response2 = await sectionApi.getFileResources(id);
            //const collection = await sectionApi.getItem(id);

            setStateFile({
                //collection: collection,
                itemsF: response2.items,
                itemsFCount: response2.count
            });
            //console.log("collections: ", collection);
            console.log("response2: ", response2);

        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        ...stateFile
    };
};

///////////////////////////////////////////////////

const Page = () => {
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);

    //console.log("itemsStoreCollection ID: ", itemsStore.items[0]._id)


    //console.log("itemsStore: ", itemsStore);
    //console.log("itemsStoreCollection ID: ", itemsStore.items[0]._id);
    //const itemsStoreFiles = useItemsStoreFiles("648b05000cf7d4c31a8a4b1d");
    //console.log("itemsStoreFiles: ", itemsStoreFiles);      

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    {sectionApi.SECTION_TITLE}
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
                                        href={paths.app[sectionApi.section].index}
                                        variant="subtitle2"
                                    >
                                        {sectionApi.SECTION_TITLE}
                                    </Link>
                                    <Typography
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        List
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={3}
                            >
                                <Button
                                    component={RouterLink}
                                    href={paths.app[sectionApi.section].create}
                                    startIcon={(
                                        <SvgIcon>
                                            <PlusIcon/>
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                >
                                    Add
                                </Button>
                            </Stack>
                        </Stack>
                        <Card>
                            <FileCollectionListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>
                            <FileCollectionListTable
                                onPageChange={itemsSearch.handlePageChange}
                                onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                                page={itemsSearch.state.page}
                                items={itemsStore.items}
                                count={itemsStore.itemsCount}
                                rowsPerPage={itemsSearch.state.rowsPerPage}
                                sectionApi={sectionApi}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>


        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
