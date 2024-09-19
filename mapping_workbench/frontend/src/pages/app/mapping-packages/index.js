import {useEffect, useState} from 'react';

import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {Upload04 as ImportIcon} from '@untitled-ui/icons-react/build/esm';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {useDialog} from "src/hooks/use-dialog";
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {ListTable} from "src/sections/app/mapping-package/list-table";
import {ListSearch} from "src/sections/app/mapping-package/list-search";
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {mappingPackagesApi as sectionApi} from 'src/api/mapping-packages';
import {PackageImporter} from 'src/sections/app/mapping-package/package-importer';

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        sortDirection: undefined,
        sortField: '',
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const handleFiltersChange = filters => {
        setState(prevState => ({
            ...prevState,
            filters,
            page: 0
        }));
    };

    const handleSorterChange = sortField => {
        setState(prevState => ({
            ...prevState,
            sortField,
            sortDirection: state.sortField === sortField && prevState.sortDirection === -1 ? 1 : -1
        }))
    }

    const handlePageChange = (event, page) => {
        setState(prevState => ({
            ...prevState,
            page
        }));
    };

    const handleRowsPerPageChange = event => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    };

    return {
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleSorterChange,
        state
    };
};


const useItemsStore = searchState => {
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
            .catch(err => console.error(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};


const Page = () => {
    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);

    const importDialog = useDialog();

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
                            component={RouterLink}
                            id="add_package_button"
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
                        <Button
                            onClick={importDialog.handleOpen}
                            id="import_package_button"
                            startIcon={(
                                <SvgIcon>
                                    <ImportIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Import
                        </Button>
                    </Stack>

                </Stack>
                <Card>
                    <ListSearch onFiltersChange={itemsSearch.handleFiltersChange}/>
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        page={itemsSearch.state.page}
                        items={itemsStore.items}
                        count={itemsStore.itemsCount}
                        onSort={itemsSearch.handleSorterChange}
                        sort={{direction: itemsSearch.state.sortDirection, column: itemsSearch.state.sortField}}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                    />
                </Card>
            </Stack>

            <PackageImporter
                onClose={importDialog.handleClose}
                open={importDialog.open}
                sectionApi={sectionApi}
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
