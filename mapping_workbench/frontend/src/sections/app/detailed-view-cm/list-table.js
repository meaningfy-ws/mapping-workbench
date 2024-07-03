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
        onPageChange = () => {},
        onSort = () => {},
        sort,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return(
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
                            <TableCell width="25%">
                                <SorterHeader fieldName="min_sdk_version"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="max_sdk_version"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="source_structural_element"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="target_class_path"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="target_property_path"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="sdk_element_id"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="absolute_xpath"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => {
                            const item_id = item._id;

                            return (
                                    <TableRow hover
                                              key={item_id}>
                                        <TableCell width="25%">
                                            {item.min_sdk_version}
                                        </TableCell>
                                        <TableCell>
                                            {item.max_sdk_version}
                                        </TableCell>
                                        <TableCell>
                                            {item.source_structural_element?.collection}
                                        </TableCell>
                                        <TableCell>
                                            {item.target_class_path}
                                        </TableCell>
                                        <TableCell>
                                            {item.target_property_path}
                                        </TableCell>
                                        <TableCell>
                                            {item.triple_map_fragment?.sdk_element_id}
                                        </TableCell>
                                        <TableCell>
                                            {item.triple_map_fragment?.absolute_xpath}
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
