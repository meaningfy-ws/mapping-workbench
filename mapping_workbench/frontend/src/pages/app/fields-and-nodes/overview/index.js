import {useEffect, useState} from 'react';

import {Upload04 as ImportIcon} from '@untitled-ui/icons-react/build/esm';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from '@mui/material/Typography';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {Filter} from 'src/sections/components/filter';
import {ListTable} from 'src/sections/app/fields-registry/list-table';
import {fieldsOverviewApi as sectionApi} from 'src/api/fields-overview';
import {ListSearch} from 'src/sections/app/fields-registry/list-search';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";

const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: "",
        sort: {
            column: "",
            direction: "desc"
        },
        search: '',
        searchColumns: ["sdk_element_id", "relative_xpath", "absolute_xpath"],
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const filterValues = [{label: 'All', value: ''},
        {label: 'Node', value: 'node'},
        {label: 'Field', value: 'field'}]


    const searchItems = state.search ? items.filter(item => {
        let returnItem = null;
        state.searchColumns.forEach(column => {
            if (item[column]?.toLowerCase()?.includes(state.search.toLowerCase()))
                returnItem = item
        })
        return returnItem
    }) : items

    const filteredItems = searchItems.filter((item) => state.filters === "" || state.filters === item.element_type ? item : null)

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

    const handleSort = (column, desc) => {
        setState(prevState => ({
            ...prevState, sort: {
                column,
                direction: prevState.sort.column === column
                    ? prevState.sort.direction === "desc"
                        ? "asc"
                        : "desc"
                    : desc
                        ? "desc"
                        : "asc"
            }
        }))
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
        handleSort,
        handleSearchItems,
        filterValues,
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
        sectionApi.getItems({}, null, '/fields_registry/elements')
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
        []);

    return {
        ...state
    };
};


const Page = () => {
    const itemsStore = useItemsStore();
    const itemsSearch = useItemsSearch(itemsStore.items);

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
                            component={RouterLink}
                            href={paths.app.fields_and_nodes.overview.elements.create}
                            id="add-field-button"
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
                            id="import_shema_button"
                            component={RouterLink}
                            href={paths.app.fields_and_nodes.overview.import}
                            startIcon={(
                                <SvgIcon>
                                    <ImportIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Import schema from github
                        </Button>
                    </Stack>

                </Stack>
                <Card>
                    <ListSearch onFiltersChange={itemsSearch.handleSearchItems}/>
                    <Filter values={itemsSearch.filterValues}
                            value={itemsSearch.state.filters}
                            onValueChange={itemsSearch.handleFiltersChange}/>
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        sort={itemsSearch.state.sort}
                        onSort={itemsSearch.handleSort}
                        page={itemsSearch.state.page}
                        items={itemsSearch.pagedItems}
                        count={itemsStore.itemsCount}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                    />
                </Card>
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
