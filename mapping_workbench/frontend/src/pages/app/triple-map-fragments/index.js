import {useEffect, useState} from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {RouterLink} from 'src/components/router-link';
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {genericTripleMapFragmentsApi as sectionApi} from 'src/api/triple-map-fragments/generic';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {ListSearch} from "src/sections/app/generic-triple-map-fragment/list-search";
import {ListTable} from "src/sections/app/generic-triple-map-fragment/list-table";
import {useDialog} from "src/hooks/use-dialog";
import {FileUploader} from "src/sections/app/generic-triple-map-fragment/file-uploader";

const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {},
        sort: {
            column: "",
            direction: "desc"
        },
        search: '',
        searchColumns: ['triple_map_content', 'triple_map_uri'],
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const {show, ...filters} = state.filters

    const searchItems = state.search ? items.filter(item => {
        let returnItem = null;
        state.searchColumns.forEach(column => {
            if (item[column]?.toLowerCase()?.includes(state.search.toLowerCase()))
                returnItem = item
        })
        return returnItem
    }) : items

    const filteredItems = searchItems.filter((item) => {
        let returnItem = item;
        Object.entries(filters).forEach(filter => {
            const [key, value] = filter
            if (value !== "" && value !== undefined && typeof item[key] === "boolean" && item[key] !== (value == "true"))
                returnItem = null
            if (value !== undefined && typeof item[key] === "string" && !item[key].toLowerCase().includes(value.toLowerCase))
                returnItem = null
        })
        return returnItem
    })

    const sortedItems = () => {
        const sortColumn = state.sort.column
        if (!sortColumn) {
            return filteredItems
        } else {
            return filteredItems.sort((a, b) => {
                if (typeof a[sortColumn] === "string")
                    return state.sort.direction === "asc" ?
                        a[sortColumn]?.localeCompare(b[sortColumn]) :
                        b[sortColumn]?.localeCompare(a[sortColumn])
                else
                    return state.sort.direction === "asc" ?
                        a[sortColumn] - b[sortColumn] :
                        b[sortColumn] - a[sortColumn]
            })
        }
    }

    const pagedItems = sortedItems().filter((item, i) => {
        const pageSize = state.page * state.rowsPerPage
        if ((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

    const handleSearchItems = (filters) => {
        setState(prevState => ({...prevState, search: filters.q, page: 0}))
    }

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

    const handleSorterChange = sortField => {
        setState(prevState => ({
            ...prevState,
            sortField,
            sortDirection: state.sortField === sortField && prevState.sortDirection === -1 ? 1 : -1
        }))
    }

    return {
        handleSorterChange,
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleSearchItems,
        pagedItems,
        count: filteredItems.length,
        state
    };
};


const useItemsStore = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems({rowsPerPage: -1})
            .then(res =>
                setState({
                    items: res.items,
                    itemsCount: res.count
                }))
            .catch(err => console.warn(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []);

    return {
        ...state
    };
};


const Page = () => {
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items);

    const uploadDialog = useDialog();

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
                            onClick={uploadDialog.handleOpen}
                            startIcon={(
                                <SvgIcon>
                                    <Upload01Icon/>
                                </SvgIcon>
                            )}
                            id="upload_fragment_button"
                            variant="contained"
                        >
                            Upload
                        </Button>
                        <Button
                            component={RouterLink}
                            href={paths.app[sectionApi.section].create}
                            startIcon={(
                                <SvgIcon>
                                    <PlusIcon/>
                                </SvgIcon>
                            )}
                            id="add_button"
                            variant="contained"
                        >
                            Add
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <ListSearch onFiltersChange={itemsSearch.handleSearchItems}/>
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        page={itemsSearch.state.page}
                        items={itemsSearch.pagedItems}
                        count={itemsSearch.itemsCount}
                        onSort={itemsSearch.handleSorterChange}
                        sort={{direction: itemsSearch.state.sortDirection, column: itemsSearch.state.sortField}}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                    />
                </Card>
                <FileUploader
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
