import {capitalize} from '@mui/material';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

import {Box} from "@mui/system";
import Table from '@mui/material/Table';
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Typography from '@mui/material/Typography';
import {getValidationColor} from '../mapping-package/state/utils';

import {ResultChip} from "./utils";
import {Scrollbar} from 'src/components/scrollbar';
import TablePagination from "src/sections/components/table-pagination-pages";
import TableSorterHeader from "src/sections/components/table-sorter-header";

import PropTypes from "prop-types";
import {useHighlighterTheme} from "../../../hooks/use-highlighter-theme";
import {TableFilterHeader} from "../../../layouts/app/table-filter-header/table-filter-header";

const Condition = ({text, value}) => {
    const color = value ? 'green' : 'red'
    return <span style={{textWrap: 'nowrap'}}>{`${text} `}<b style={{color}}>{`${value}`}</b></span>
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
                            <TableCell width="15%">
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="title"
                                                   title="Field"/>
                            </TableCell>
                            <TableCell align="left">
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="xpath_condition"
                                                   title="XPath Condition"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="description"
                                              title=""/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="query"
                                              title="Query"/>
                            </TableCell>
                            <TableCell align="left">
                                <SorterHeader fieldName="result"
                                              title="result"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, key) => {
                            return (
                                <TableRow key={key}>
                                    <TableCell width="15%">
                                        <Typography variant="subtitle3">
                                            {item.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {item?.xpath_condition?.xpath_condition &&
                                            <><Stack
                                                direction="column"
                                                spacing={1}
                                            >
                                                <Stack
                                                    direction="row"
                                                    justifyContent="left"
                                                    alignItems="center"
                                                    spacing={2}
                                                >
                                                    <SyntaxHighlighter
                                                        language="xquery"
                                                        wrapLines
                                                        customStyle={{
                                                            borderRadius: 12,
                                                            border: '1px solid #E4E7EC'
                                                        }}
                                                        style={syntaxHighlighterTheme}
                                                        lineProps={{
                                                            style: {
                                                                wordBreak: 'break-all',
                                                                whiteSpace: 'pre-wrap'
                                                            }
                                                        }}>
                                                        {item?.xpath_condition?.xpath_condition || '-'}
                                                    </SyntaxHighlighter>
                                                    {item?.meets_xpath_condition ?
                                                        <CheckIcon color="success"/> :
                                                        <CloseIcon color="error"/>}
                                                </Stack>
                                            </Stack>
                                                <Divider sx={{my: 1}}/></>
                                        }
                                        <Box sx={{overflowX: 'auto', width: '400px'}}>
                                            <Typography variant="subtitle3">
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <SyntaxHighlighter
                                            language="sparql"
                                            wrapLines
                                            style={syntaxHighlighterTheme}
                                            customStyle={{
                                                borderRadius: 12,
                                                border: '1px solid #E4E7EC'
                                            }}
                                            lineProps={{
                                                style: {
                                                    overflowWrap: 'break-word',
                                                    whiteSpace: 'pre-wrap'
                                                }
                                            }}>
                                            {item.query}
                                        </SyntaxHighlighter>
                                    </TableCell>
                                    <TableCell align="left">
                                        <ResultChip color={getValidationColor(item.result)}
                                                    fontColor='#fff'>
                                            {capitalize(item.result)}
                                        </ResultChip>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Box>
                                            <Condition text='Fields covered:'
                                                       value={item.fields_covered}/>
                                            <Divider sx={{my: 1}}/>
                                            <Condition text='XPath condition fulfilled:'
                                                       value={item.fields_covered}/>
                                            <Divider sx={{my: 1}}/>
                                            <Condition text='Query result:'
                                                       value={item.query_result}/>
                                        </Box>
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
    items:
    PropTypes.array,
    onPageChange:
    PropTypes.func,
    onRowsPerPageChange:
    PropTypes.func,
    page:
    PropTypes.number,
    rowsPerPage:
    PropTypes.number
};
