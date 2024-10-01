import {useCallback, useEffect, useMemo, useState} from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {Seo} from 'src/components/seo';
import {customersApi} from 'src/api/customers';
import {usePageView} from 'src/hooks/use-page-view';
import {useSelection} from 'src/hooks/use-selection';
import {Layout as AppLayout} from 'src/layouts/app';
import {CustomerListSearch} from 'src/sections/app/authorization/authorization-search';
import {CustomerListTable} from 'src/sections/app/authorization/authorization-table';

const useCustomersSearch = (items) => {
    const [state, setState] = useState({
        page: 0,
        rowsPerPage: 5,
        sort: {
            direction: '',
            column: ''
        },
        filters: {},
        search: '',
        searchColumns: ["name", "email"],
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

    const handleSearchChange = useCallback(search => {
        setState(prevState => ({
            ...prevState,
            search,
        }));
    }, []);


    const handlePageChange = useCallback((event, page) => {
        setState(prevState => ({
            ...prevState,
            page,
        }));
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }, []);

    const handleSort = useCallback((column, desc) => {
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
    }, [])


    return {
        handleSearchChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleSort,
        pagedItems,
        state,
    };
};

const useCustomersStore = (searchState) => {
    const [state, setState] = useState({
        customers: [],
        customersCount: 0,
    });

    const handleCustomersGet = () => {
        customersApi.getCustomers()
            .then(res => setState({customers: res.data, customersCount: res.count}))
            .catch(err => console.error(err))
    }

    useEffect(
        () => {
            handleCustomersGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return {
        ...state,
    };
};

const useCustomersIds = (customers = []) => {
    return useMemo(() => customers.map((customer) => customer.id), [customers]);
};

const Page = () => {
    const customersStore = useCustomersStore();
    const customersSearch = useCustomersSearch(customersStore.customers);
    const customersIds = useCustomersIds(customersStore.customers);
    const customersSelection = useSelection(customersIds);

    usePageView();

    return (
        <>
            <Seo title="Dashboard: Customer List"/>

            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">Authorization</Typography>
                    </Stack>
                </Stack>
                <Card>
                    <CustomerListSearch
                        onSearchChange={customersSearch.handleSearchChange}
                    />
                    <CustomerListTable
                        count={customersStore.customersCount}
                        items={customersSearch.pagedItems}
                        onDeselectAll={customersSelection.handleDeselectAll}
                        onDeselectOne={customersSelection.handleDeselectOne}
                        onPageChange={customersSearch.handlePageChange}
                        onRowsPerPageChange={customersSearch.handleRowsPerPageChange}
                        onSelectAll={customersSelection.handleSelectAll}
                        onSelectOne={customersSelection.handleSelectOne}
                        page={customersSearch.state.page}
                        rowsPerPage={customersSearch.state.rowsPerPage}
                        selected={customersSelection.selected}
                        sort={customersSearch.state.sort}
                        onSort={customersSearch.handleSort}
                    />
                </Card>
            </Stack>
        </>
    );
};

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Page;
