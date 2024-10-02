import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {codeStyle} from "src/utils/code-style";
import {Scrollbar} from 'src/components/scrollbar';
import TablePagination from 'src/sections/components/table-pagination';
import TableSorterHeader from "src/sections/components/table-sorter-header";

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

    const SorterHeader = (props) => <TableSorterHeader sort={sort}
                                                       onSort={onSort}
                                                       {...props}
    />

    return (
        <TablePagination
            component="div"
            count={count}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
        >
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <SorterHeader fieldName="short_focus_node"
                                              title="Focus Node"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="message"
                                              title="Message"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="short_result_path"
                                              title="Result Path"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="short_result_severity"
                                              title="Result Severity"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="short_source_constraint_component"
                                              title="Source Constraint Component"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, key) => {
                            return (
                                <TableRow key={key}>
                                    <TableCell width="25%">
                                        <SyntaxHighlighter
                                            language="turtle"
                                            wrapLines
                                            style={codeStyle}
                                            lineProps={{style: {overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}}>
                                            {item.short_focus_node}
                                        </SyntaxHighlighter>
                                    </TableCell>
                                    <TableCell>
                                        <SyntaxHighlighter
                                            language="turtle"
                                            wrapLines
                                            style={codeStyle}
                                            lineProps={{style: {overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}}>
                                            {item.message}
                                        </SyntaxHighlighter>
                                    </TableCell>
                                    <TableCell>
                                        <SyntaxHighlighter
                                            language="sparql"
                                            wrapLines
                                            style={codeStyle}
                                            lineProps={{style: {overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}}>
                                            {item.short_result_path}
                                        </SyntaxHighlighter>
                                    </TableCell>
                                    <TableCell>
                                        <SyntaxHighlighter
                                            language="turtle"
                                            wrapLines
                                            style={codeStyle}
                                            lineProps={{style: {overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}}>
                                            {item.short_result_severity}
                                        </SyntaxHighlighter>
                                    </TableCell>
                                    <TableCell>
                                        <SyntaxHighlighter
                                            language="turtle"
                                            wrapLines
                                            style={codeStyle}
                                            lineProps={{style: {overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}}>
                                            {item.short_source_constraint_component}
                                        </SyntaxHighlighter>
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

ListTableFile.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
