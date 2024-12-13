import {Fragment, useState} from 'react';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {MenuActions} from '../../../components/menu-actions';
import {ChevronButton} from '../../components/chevron-button';
import TablePagination from "../../components/table-pagination-pages";
import TableSorterHeader from "../../components/table-sorter-header";


export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        sort,
        onSort = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;


    const [currentItem, setCurrentItem] = useState(null);

    const handleItemToggle = itemId => {
        setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);
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
                                <TableCell/>
                                <SorterHeader fieldName='short_term'
                                              title='Term'/>
                                <SorterHeader fieldName='type'
                                              title='Type'/>
                                <TableCell align="right"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map(item => {
                                const item_id = item._id;
                                const isCurrent = item_id === currentItem;

                                return (
                                    <Fragment key={item_id}>
                                        <TableRow
                                            hover
                                            key={item_id}
                                        >
                                            <TableCell
                                                padding="checkbox"
                                                sx={{
                                                    ...(isCurrent && {
                                                        position: 'relative',
                                                        '&:after': {
                                                            position: 'absolute',
                                                            content: '" "',
                                                            top: 0,
                                                            left: 0,
                                                            backgroundColor: 'primary.main',
                                                            width: 3,
                                                            height: 'calc(100% + 1px)'
                                                        }
                                                    })
                                                }}
                                                width="25%"
                                            >
                                                <ChevronButton onClick={() => handleItemToggle(item_id)}
                                                               isCurrent={isCurrent}/>
                                            </TableCell>
                                            <TableCell width="25%">
                                                <Typography variant="subtitle2">
                                                    {item.short_term}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {item.type}
                                            </TableCell>
                                            <TableCell align="right">
                                                <MenuActions>
                                                    <ListItemActions
                                                        itemctx={new ForListItemAction(item_id, sectionApi)}/>
                                                </MenuActions>
                                            </TableCell>
                                        </TableRow>
                                        {isCurrent && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    sx={{
                                                        p: 0,
                                                        position: 'relative',
                                                        '&:after': {
                                                            position: 'absolute',
                                                            content: '" "',
                                                            top: 0,
                                                            left: 0,
                                                            backgroundColor: 'primary.main',
                                                            width: 3,
                                                            height: 'calc(100% + 1px)'
                                                        }
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Typography variant="subtitle2">
                                                            {item.term}
                                                        </Typography>
                                                    </CardContent>
                                                    <Divider/>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
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
