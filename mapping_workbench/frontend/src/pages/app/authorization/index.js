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

const useCustomersSearch = () => {
    const [state, setState] = useState({
        page: 0,
        rowsPerPage: 5,
        sortBy: 'updatedAt',
        sortDir: 'desc',
    });

    const handleFiltersChange = useCallback((filters) => {
        setState(prevState => ({
            ...prevState,
            filters,
        }));
    }, []);

    const handleSortChange = useCallback((sort) => {
        setState(prevState => ({
            ...prevState,
            sortBy: sort.sortBy,
            sortDir: sort.sortDir,
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

    return {
        handleFiltersChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        state,
    };
};

const useCustomersStore = (searchState) => {
    const [state, setState] = useState({
        customers: [],
        customersCount: 0,
    });

    const handleCustomersGet = () => {
        customersApi.getCustomers(searchState)
            .then(res => setState({customers: res.data, customersCount: res.count}))
            .catch(err => console.error(err))
    }

    useEffect(
        () => {
            handleCustomersGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]
    );

    return {
        ...state,
    };
};

const useCustomersIds = (customers = []) => {
    return useMemo(() =>  customers.map((customer) => customer.id), [customers]);
};

const Page = () => {
    const customersSearch = useCustomersSearch();
    const customersStore = useCustomersStore(customersSearch.state);
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
                        onFiltersChange={customersSearch.handleFiltersChange}
                        onSortChange={customersSearch.handleSortChange}
                        sortBy={customersSearch.state.sortBy}
                        sortDir={customersSearch.state.sortDir}
                    />
                    <CustomerListTable
                        count={customersStore.customersCount}
                        items={customersStore.customers}
                        onDeselectAll={customersSelection.handleDeselectAll}
                        onDeselectOne={customersSelection.handleDeselectOne}
                        onPageChange={customersSearch.handlePageChange}
                        onRowsPerPageChange={customersSearch.handleRowsPerPageChange}
                        onSelectAll={customersSelection.handleSelectAll}
                        onSelectOne={customersSelection.handleSelectOne}
                        page={customersSearch.state.page}
                        rowsPerPage={customersSearch.state.rowsPerPage}
                        selected={customersSelection.selected}
                    />
                </Card>
            </Stack>
        </>
    );
};

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Page;
