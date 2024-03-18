
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from "@mui/material/Tooltip";

import {Scrollbar} from 'src/components/scrollbar';
import PropTypes from 'prop-types';

export const ListTableFile = (props) => {

    const {
        count = 0,
        items = [],
        onPageChange,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sort,
        onSort,
        sectionApi
    } = props;

    const SorterHeader = ({fieldName, title}) => {
        return <Tooltip enterDelay={300}
                       title="Sort"
               >
                   <TableSortLabel
                        active={sort.column === fieldName}
                        direction={sort.direction}
                        onClick={() => onSort(fieldName)}>
                        {title ?? fieldName}
                    </TableSortLabel>
               </Tooltip>
    }

    return (
        <>
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
                                <SorterHeader fieldName="focus_node"
                                              title="Focus Node"/>
                            </TableCell>
                            <TableCell width="25%">
                                <SorterHeader fieldName="message"
                                              title="Message"/>
                            </TableCell>
                            <TableCell>
                                 <SorterHeader fieldName="result_path"
                                               title="Result Path"/>
                            </TableCell>
                            <TableCell align="left">
                                <SorterHeader fieldName="result_severity"
                                              title="Result Severity"/>
                            </TableCell>
                             <TableCell align="left">
                                <SorterHeader fieldName="source_constraint_component"
                                              title="Source Constraint Component"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, key) => {
                            return (
                                <TableRow key={key}>
                                    <TableCell width="25%">
                                        {item.focus_node}
                                    </TableCell>
                                    <TableCell>
                                        {item.message}
                                    </TableCell>
                                    <TableCell>
                                        {item.result_path}
                                    </TableCell>
                                    <TableCell>
                                        {item.result_severity}
                                    </TableCell>
                                    <TableCell>
                                        {item.source_constraint_component}
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
        </>
    );
};

ListTableFile.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
