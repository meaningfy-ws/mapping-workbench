import {useCallback, useEffect, useState} from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {usersApi as sectionApi} from "../../../api/authorization";
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
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

const useCustomersStore = () => {
    const [state, setState] = useState([]);
    const [roles, setRoles] = useState([])

    const handleCustomersGet = () => {
        sectionApi.getItems()
            .then(res => setState(res))
            .catch(err => console.error(err))
    }

    const handleRolesGet = () => {
        sectionApi.getRoles()
            .then(res => setRoles(res))
            .catch(err => console.error(err))
    }

    const handleCustomerAuthorizeChange = (id, is_verified) => {
        if (is_verified) {
            sectionApi.authorize([id])
                .then(res =>
                    setState(e => e.map(el => el._id === id ? {...el, is_verified, is_active:is_verified} : el)))
                .catch(err => console.error(err))
        } else {
            sectionApi.unauthorize([id])
                .then(res =>
                    setState(e => e.map(el => el._id === id ? {...el, is_verified,is_active:is_verified} : el)))
                .catch(err => console.error(err))
        }
    }

    const handleCustomerTypeChange = (id, role) => {
        sectionApi.update_roles([id], [role])
            .then(res =>
                setState(e => e.map(el => el._id === id ? {...el, roles:[role]} : el)))
            .catch(err => console.error(err))
    }

    useEffect(
        () => {
            handleCustomersGet();
            handleRolesGet()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return {
        handleCustomerAuthorizeChange,
        handleCustomerTypeChange,
        state,
        roles
    };
};


const Page = () => {
    const customersStore = useCustomersStore();
    const customersSearch = useCustomersSearch(customersStore.state);

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
                        <Typography variant="h4">{sectionApi.SECTION_TITLE}</Typography>
                    </Stack>
                </Stack>
                <Card>
                    <CustomerListSearch
                        onSearchChange={customersSearch.handleSearchChange}
                    />
                    <CustomerListTable
                        count={customersStore.state.length}
                        items={customersSearch.pagedItems}
                        onPageChange={customersSearch.handlePageChange}
                        onRowsPerPageChange={customersSearch.handleRowsPerPageChange}
                        page={customersSearch.state.page}
                        rowsPerPage={customersSearch.state.rowsPerPage}
                        onAuthorizeChange={customersStore.handleCustomerAuthorizeChange}
                        onTypeChange={customersStore.handleCustomerTypeChange}
                        sort={customersSearch.state.sort}
                        onSort={customersSearch.handleSort}
                        roles={customersStore.roles}
                    />
                </Card>
            </Stack>
        </>
    );
};

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Page;
