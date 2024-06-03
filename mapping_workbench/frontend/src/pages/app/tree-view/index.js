import {useEffect, useState} from 'react';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {paths} from 'src/paths';
import {fieldsRegistryApi as sectionApi} from 'src/api/fields-registry';
import {Layout as AppLayout} from 'src/layouts/app';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import TreeView from "../../../sections/app/tree-view/tree-view";

const useItemsSearch = (items) => {
    const [state, setState] = useState({
        filters: {},
        sort: {
            column: '',
            direction: 'desc'
        },
        search: '',
        searchColumns:["task_name","created_at","start_time","finished_at","status"],
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE
    });

    const {show, ...filters} = state.filters

    const searchItems = state.search ? items.filter(item => {
        let returnItem = null;
        state.searchColumns.forEach(column => {
            if(item[column]?.toLowerCase()?.includes(state.search.toLowerCase()))
                returnItem = item
        })
        return returnItem
     }) : items

     const filteredItems = searchItems.filter((item) => {
        let returnItem = item;
        Object.entries(filters).forEach(filter=> {
            const [key, value] = filter
            if(value !== "" && value !== undefined && typeof item[key] === "boolean" && item[key] !== (value == "true"))
                returnItem = null
            if(value !== undefined && typeof item[key] === "string" && !item[key].toLowerCase().includes(value.toLowerCase))
                returnItem = null
        })
        return returnItem
     })

    const sortedItems = () => {
        const sortColumn = state.sort.column
        if(!sortColumn) {
            return filteredItems
        } else {
            return filteredItems.sort((a,b) => {
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
        if((pageSize <= i && pageSize + state.rowsPerPage > i) || state.rowsPerPage < 0)
            return item
    })

    const handleSearchItems = (filters) => {
        setState(prevState => ({...prevState, search: filters.q }))
    }


    const handleFiltersChange = (filters) => {
        setState(prevState => ({
            ...prevState,
            filters,
            page: 0
        }));
    };

    const handlePageChange = (event, page) => {
        setState(prevState => ({
            ...prevState,
            page
        }));
    };

     const handleSort = (column, desc) => {
        setState(prevState=> ({ ...prevState, sort: {column,
               direction: prevState.sort.column === column
                   ? prevState.sort.direction === "desc"
                       ? "asc"
                       : "desc"
                   : desc
                       ? "desc"
                       : "asc"}}))

    }

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
        handleSort,
        handleSearchItems,
        pagedItems,
        count: filteredItems.length,
        state
    };
};

export const Page = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
    });

    const itemsSearch = useItemsSearch(state.items);

    const handleItemsGet = () => {
        setState(prevState => ({...prevState, load: true}))
        sectionApi.getItems(itemsSearch.state)
            .then(res =>
                setState({
                    items: res.tasks_metadata,
                    itemsCount: res.tasks_metadata.length})
            )
            .catch(err => {
                console.error(err)
            });
    }

    const handleDeleteAllTasks = () => {
        const toastId = toastLoad('Deleting all tasks...');
        sectionApi.deleteAllTasks()
            .then(res => {
                toastSuccess('All tasks deleted successfully', toastId)
                handleItemsGet()
            })
            .catch(err => toastError(err, toastId))
    }


    const handleCancelAction = itemId => {
        const toastId = toastLoad('Canceling task...');
        sectionApi.cancelTask(itemId)
        .then(() => {
            toastSuccess('Task canceled successfully', toastId)
            handleItemsGet()
        })
        .catch(err => toastError(err, toastId))
    }

    const handleDeleteAction = itemId => {
        const toastId = toastLoad('Deleting task...');
        sectionApi.deleteTask(itemId)
        .then(() => {
            toastSuccess('Task delete successfully', toastId)
            handleItemsGet()
        })
        .catch(err => toastError(err, toastId))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
[]);

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TREE_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {sectionApi.SECTION_TREE_TITLE}
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
                                href={paths.app.tree_view.index}
                                variant="subtitle2"
                            >
                                {sectionApi.SECTION_TREE_TITLE}
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                List
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    {/*<Stack*/}
                    {/*    alignItems="center"*/}
                    {/*    direction="row"*/}
                    {/*    spacing={3}*/}
                    {/*>*/}
                    {/*    <Button*/}
                    {/*        id="refresh_button"*/}
                    {/*        color="inherit"*/}
                    {/*        startIcon={<SvgIcon><AutorenewIcon/></SvgIcon>}*/}
                    {/*        variant="contained"*/}
                    {/*        onClick={handleItemsGet}*/}
                    {/*    >*/}
                    {/*        Refresh*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*        id="delete_all_button"*/}
                    {/*        color="error"*/}
                    {/*        startIcon={<SvgIcon><DeleteOutlineIcon/></SvgIcon>}*/}
                    {/*        variant="contained"*/}
                    {/*        onClick={handleDeleteAllTasks}*/}
                    {/*    >*/}
                    {/*        Delete All Tasks*/}
                    {/*    </Button>*/}
                    {/*</Stack>*/}
                </Stack>
                <Card>
                    <TreeView sectionApi={sectionApi}/>
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
