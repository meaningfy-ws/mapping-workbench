import {useEffect, useState} from 'react';


import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {detailedViewCmApi as sectionApi} from 'src/api/detailed-view-cm';
import {paths} from 'src/paths';
import {Layout as AppLayout} from 'src/layouts/app';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {ListSearch} from 'src/sections/app/detailed-view-cm/list-search';
import {ListTable} from 'src/sections/app/detailed-view-cm/list-table';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {},
        sort: {
            column: "",
            direction: "desc"
        },
        search: '',
        searchColumns: ["title", "description"],
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
        setState(prevState => ({...prevState, search: filters.q}))
    }

    const handleFiltersChange = (filters) => {
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
        handleSort,
        handleSearchItems,
        pagedItems,
        count: filteredItems.length,
        state
    };
};

export const Page = () => {
    const [listState, setListState] = useState([])
    const [currentListItem, setCurrentListItem] = useState('')
    const [itemsStore, setItemsStore] = useState({items: []})
    useEffect(() => {
        sectionApi.getList()
            .then(res => {
                if (res.items.length) {
                    setListState(res.items)
                    setCurrentListItem(res.items[0])
                }
            })
    }, []);


    useEffect(() => {
        currentListItem && getItems()
    }, [currentListItem]);

    const getItems = () => {
        sectionApi.getItems({})
            .then(res => {
                console.log(res)
                setItemsStore(res)
            })
    }

    const itemsSearch = useItemsSearch(itemsStore.items);

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE}`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            Groups {sectionApi.SECTION_TITLE}
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
                                Groups {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                </Stack>
                <Card>
                    <TextField
                        fullWidth
                        label="CM Rule"
                        onChange={e =>
                            setCurrentListItem(e.target.value)
                        }
                        select
                        value={currentListItem}
                        sx={{p: 1}}
                    >
                        {listState.map(item =>
                            <MenuItem key={item.ontology_fragment_id}
                                      value={item}>
                                {item.ontology_fragment_name}
                            </MenuItem>
                        )}
                    </TextField>
                    <ListSearch onFiltersChange={itemsSearch.handleSearchItems}/>
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        onSort={itemsSearch.handleSort}
                        sort={itemsSearch.state.sort}
                        page={itemsSearch.state.page}
                        items={itemsSearch.pagedItems}
                        count={itemsSearch.count}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
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
