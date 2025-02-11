import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {Scrollbar} from 'src/components/scrollbar';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import TablePagination from 'src/sections/components/table-pagination';
import {LocalHighlighter} from 'src/sections/components/local-highlighter';
import {TableFilterHeader} from "src/layouts/app/table-filter-header/table-filter-header";


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
        filters,
        onFilter,
        sectionApi
    } = props;

    const syntaxHighlighterTheme = useHighlighterTheme()

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
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="short_focus_node"
                                                   title="Focus Node"/>
                            </TableCell>
                            <TableCell>
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="message"
                                                   title="Message"/>
                            </TableCell>
                            <TableCell>
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="short_result_path"
                                                   title="Result Path"/>
                            </TableCell>
                            <TableCell>
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="short_result_severity"
                                                   title="Result Severity"/>
                            </TableCell>
                            <TableCell>
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="short_source_constraint_component"
                                                   title="Constraint Type"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, key) => {
                            return (
                                <TableRow key={key}>
                                    <TableCell width="25%">
                                        <LocalHighlighter language='turtle'
                                                          text={item.short_focus_node}
                                                          style={syntaxHighlighterTheme}/>
                                    </TableCell>
                                    <TableCell>
                                        <LocalHighlighter language='turtle'
                                                          text={item.message}
                                                          style={syntaxHighlighterTheme}/>
                                    </TableCell>
                                    <TableCell>
                                        <LocalHighlighter language='sparql'
                                                          text={item.short_result_path}
                                                          style={syntaxHighlighterTheme}/>
                                    </TableCell>
                                    <TableCell>
                                        <LocalHighlighter language='turtle'
                                                          text={item.short_result_severity}
                                                          style={syntaxHighlighterTheme}/>
                                    </TableCell>
                                    <TableCell>
                                        <LocalHighlighter language='turtle'
                                                          text={item.short_source_constraint_component}
                                                          style={syntaxHighlighterTheme}/>
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
