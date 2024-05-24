import {useEffect, useState} from 'react';

import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from 'src/components/router-link';
import {testDataSuitesApi as sectionApi} from 'src/api/test-data-suites';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {FileCollectionListSearch} from 'src/sections/app/file-manager/file-collection-list-search';
import {Upload04 as ImportIcon} from '@untitled-ui/icons-react/build/esm';
import {TestDataCollectionListTable} from "../../../sections/app/file-manager/test-data-collection-list-table";
import {sparqlTestFileResourcesApi as fileResourcesApi} from "../../../api/sparql-test-suites/file-resources";
import {FileUploader} from "../../../sections/app/file-manager/file-uploader";
import {useDialog} from "../../../hooks/use-dialog";


const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const handleFiltersChange = filters => {
        setState(prevState => ({
            ...prevState,
            filters,
            page: 0
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
        handlePageChange,
        handleRowsPerPageChange,
        state
    };
};

const useItemsStore = (searchState) => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems(searchState)
            .then(res => setState({
                items: res.items,
                itemsCount: res.count
            }))
            .catch(err => console.warn(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        handleItemsGet,
        ...state
    };
};

const Page = () => {

    const uploadDialog = useDialog()
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
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
                            id="add_button"
                        >
                            Create Test Data Suite
                        </Button>
                        <Button
                            type='link'
                            onClick={uploadDialog.handleOpen}
                            startIcon={(
                                <SvgIcon>
                                    <ImportIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                            id="import-test-data_button"
                        >
                            Import Test Data Suites
                        </Button>
                        {/*<Button*/}
                        {/*    component={RouterLink}*/}
                        {/*    href={paths.app[sectionApi.section].tasks.transform_test_data}*/}
                        {/*    startIcon={(*/}
                        {/*        <SvgIcon>*/}
                        {/*            <TaskIcon/>*/}
                        {/*        </SvgIcon>*/}
                        {/*    )}*/}
                        {/*    variant="contained"*/}
                        {/*    id="transform-test-data_button"*/}
                        {/*>*/}
                        {/*    {t(tokens.nav.transform_test_data)}*/}
                        {/*</Button>*/}
                    </Stack>
                </Stack>
                <Card>
                    <FileCollectionListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>
                    <TestDataCollectionListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        page={itemsSearch.state.page}
                        items={itemsStore.items}
                        count={itemsStore.itemsCount}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                        getItem={itemsStore.handleItemsGet}
                    />
                </Card>
                <FileUploader
                    onClose={uploadDialog.handleClose}
                    open={uploadDialog.open}
                    collectionId={uploadDialog.data?.id}
                    sectionApi={fileResourcesApi}
                    onGetItems={itemsStore.handleItemsGet}
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
