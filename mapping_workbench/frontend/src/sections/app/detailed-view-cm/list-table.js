import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Scrollbar} from 'src/components/scrollbar';
import TablePagination from "../../components/table-pagination";
import TableSorterHeader from "../../components/table-sorter-header";


export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onSort = () => {
        },
        sort,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableSorterHeader sort={{direction, column: sort.column}}
                               onSort={onSort}
                               {...props}
            />
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
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <SorterHeader fieldName="instance_type"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="iterator_xpath"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="group_name"/>
                            </TableCell>
                            <TableCell width="25%">
                                <SorterHeader title="min_xsd_version"
                                              fieldName="min_sdk_version"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader title="max_xsd_version"
                                              fieldName="max_sdk_version"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => {
                            const item_id = item._id;

                            return (
                                <TableRow hover
                                          key={item_id}>
                                    <TableCell>
                                        {item.group_name}
                                    </TableCell>
                                    <TableCell>
                                        {item.iterator_xpath}
                                    </TableCell>
                                    <TableCell>
                                        {item.instance_type}
                                    </TableCell>
                                    <TableCell>
                                        {item.min_sdk_version}
                                    </TableCell>
                                    <TableCell>
                                        {item.max_sdk_version}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
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
