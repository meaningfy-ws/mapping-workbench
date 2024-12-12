import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import Switch from "@mui/material/Switch";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import TablePagination from "../../components/table-pagination";
import TableSorterHeader from '../../components/table-sorter-header';

export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        sort,
        onSort = () => {},
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const handleDeleteAction = (id) => {
        const toastId = toastLoad("Deleting")
        const itemctx = new ForListItemAction(id, sectionApi)
        itemctx.api.deleteItem(id)
            .then(res => {
                if (res) {
                    toastSuccess("Deleted", toastId)
                    onPageChange('', 0)
                } else toastError("Error deleting", toastId)
            })
    }

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableCell>
                <TableSorterHeader sort={{direction, column: sort.column}}
                                   onSort={onSort}
                                   {...props}
                />
            </TableCell>
        )
    }

    return (
        <TablePagination
            component="div"
            count={count}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            showFirstButton
            showLastButton
        >
            <Paper>
                <Scrollbar>
                    <Table sx={{minWidth: 1200}}>
                        <TableHead>
                            <TableRow>
                                <SorterHeader fieldName='prefix'/>
                                <SorterHeader fieldName='uri'/>
                                <TableCell>
                                    Syncable
                                </TableCell>
                                <TableCell align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const item_id = item._id;
                                const statusColor = item.status === 'published' ? 'success' : 'info';

                                return (
                                    <TableRow hover
                                              key={item_id}
                                    >
                                        <TableCell width="25%">
                                            <Typography variant="subtitle2">
                                                {item.prefix}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.uri}
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                disabled
                                                checked={item.is_syncable}
                                                value={item.is_syncable}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <ListItemActions
                                                itemctx={new ForListItemAction(item_id, sectionApi)}
                                                onDeleteAction={() => handleDeleteAction(item_id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </Paper>
        </TablePagination>
    );
};

ListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
