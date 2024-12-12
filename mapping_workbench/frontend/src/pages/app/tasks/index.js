import {useEffect, useState} from 'react';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {Layout as AppLayout} from 'src/layouts/app';
import {tasksApi as sectionApi} from 'src/api/tasks';
import {RouterLink} from 'src/components/router-link';
import useItemsSearch from 'src/hooks/use-items-search';
import {ListTable} from 'src/sections/app/tasks/list-table';
import {TableSearchBar} from "src/sections/components/table-search-bar";
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {TableLoadWrapper} from "src/sections/app/shacl-validation-report/utils";

const searchColumns = ["task_name", "created_at", "start_time", "finished_at", "status"];

export const Page = () => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0,
    });

    const itemsSearch = useItemsSearch(state.items, sectionApi, searchColumns, {},
        {
            column: 'created_at',
            direction: 'desc'
        });

    const handleItemsGet = () => {
        setState(prevState => ({...prevState, load: true}))
        sectionApi.getTasks(itemsSearch.state)
            .then(res =>
                setState({
                    items: res.tasks_metadata,
                    itemsCount: res.tasks_metadata.length
                })
            )
            .catch(err => {
                toastError(err)
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
            <Seo title={`App: ${sectionApi.TASKS_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            {sectionApi.TASKS_TITLE}
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
                                {sectionApi.TASKS_TITLE}
                            </Typography>
                        </Breadcrumbs>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button
                            id="refresh_button"
                            color="inherit"
                            startIcon={<AutorenewIcon/>}
                            onClick={handleItemsGet}
                        >
                            Refresh
                        </Button>
                        <Button
                            id="delete_all_button"
                            color="error"
                            startIcon={<DeleteOutlineIcon/>}
                            onClick={handleDeleteAllTasks}
                        >
                            Delete All Tasks
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                    value={itemsSearch.state.search[0]}
                                    placeholder='Search by Project Title'/>
                    <Divider/>
                    <TableLoadWrapper dataState={{load: state.load}}
                                      lines={5}
                                      data={state.items}>
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
                            onCancelAction={handleCancelAction}
                            onDeleteAction={handleDeleteAction}
                        />
                    </TableLoadWrapper>
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
