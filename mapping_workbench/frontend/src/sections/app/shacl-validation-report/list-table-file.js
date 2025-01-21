import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {Scrollbar} from 'src/components/scrollbar';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import TablePagination from 'src/sections/components/table-pagination-pages';
import {TableFilterHeader} from "src/layouts/app/table-filter-header/table-filter-header";

const LocalHighlighter = ({text, language, theme}) => {
    return text ? <SyntaxHighlighter
        language={language}
        wrapLines
        customStyle={{borderRadius: 12, border: '1px solid #E4E7EC'}}
        style={theme}
        lineProps={{style: {overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}}>
        {text}
    </SyntaxHighlighter> : null
}
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
                                                   title="Source Constraint Component"/>
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
                                                          theme={syntaxHighlighterTheme}/>
                                    </TableCell>
                                    <TableCell>
                                        <LocalHighlighter language='turtle'
                                                          text={item.message}
                                                          theme={syntaxHighlighterTheme}/>
                                    </TableCell>
                                    <TableCell>
                                        <LocalHighlighter language='sparql'
                                                          text={item.short_result_path}
                                                          theme={syntaxHighlighterTheme}/>
                                    </TableCell>
                                    <TableCell>
                                        <LocalHighlighter language='turtle'
                                                          text={item.short_result_severity}
                                                          theme={syntaxHighlighterTheme}/>
                                    </TableCell>
                                    <TableCell>
                                        <LocalHighlighter language='turtle'
                                                          text={item.short_source_constraint_component}
                                                          theme={syntaxHighlighterTheme}/>
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
