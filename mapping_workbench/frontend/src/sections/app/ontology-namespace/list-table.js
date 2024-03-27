import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';



export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const handleDeleteAction = (id) => {
        const itemctx= new ForListItemAction(id, sectionApi)
        itemctx.api.deleteItem(id)
            .then(res => {
                res && onPageChange(0)
            })
    }

    return (
        <div>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell width="25%">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Prefix
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                URI
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Syncable
                                    </TableSortLabel>
                                </Tooltip>
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
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />
        </div>
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
