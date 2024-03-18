
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import {Scrollbar} from 'src/components/scrollbar';
import PropTypes from 'prop-types';
import {SorterHeader as UtilsSorterHeader} from "./utils";

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

    const SorterHeader = (props) => <UtilsSorterHeader sort={sort}
                                                       onSort={onSort}
                                                       {...props}
                                                        />

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
                            <TableCell>
                                <SorterHeader fieldName="focus_node"
                                              title="Focus Node"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="message"
                                              title="Message"/>
                            </TableCell>
                            <TableCell>
                                 <SorterHeader fieldName="result_path"
                                               title="Result Path"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="result_severity"
                                              title="Result Severity"/>
                            </TableCell>
                             <TableCell>
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
