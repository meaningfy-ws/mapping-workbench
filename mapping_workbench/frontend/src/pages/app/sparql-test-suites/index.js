import {useEffect, useState} from 'react';

import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {usePageView} from 'src/hooks/use-page-view';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {sparqlTestSuitesApi as sectionApi} from 'src/api/sparql-test-suites';
import {FileCollectionListTable} from 'src/sections/app/file-manager/file-collection-list-table';
import {FileCollectionListSearch} from 'src/sections/app/file-manager/file-collection-list-search';
import {sparqlTestFileResourcesApi as fileResourcesApi} from "../../../api/sparql-test-suites/file-resources";

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

    const handleRowsPerPageChange = (event) => {
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
        itemsCount: 0,
        force: 0
    });

    const handleItemsGet = (force = 0) => {
        sectionApi.getItems(searchState)
            .then(res => setState({
                items: res.items,
                itemsCount: res.count,
                force: force
            }))
            .catch(err => console.warn(err))
    }

    useEffect(() => {
        handleItemsGet();
    }, [searchState]);

    return {
        handleItemsGet,
        ...state
    };
};

const Page = () => {
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);

    usePageView();

    const selectable = (item) => {
        return item.title !== sectionApi.CM_ASSERTIONS_SUITE_TITLE
    }

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
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            id="add_button"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={(
                                <SvgIcon>
                                    <AddIcon/>
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
                        itemsForced={itemsStore.force}
                        count={itemsStore.itemsCount}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
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