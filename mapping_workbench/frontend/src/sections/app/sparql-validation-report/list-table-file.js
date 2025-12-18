import PropTypes from "prop-types";

import {Box} from "@mui/system";
import {capitalize} from '@mui/material';
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

import {Scrollbar} from 'src/components/scrollbar';
import {CopyButton, getValidationColor, ResultChip} from '../mapping-package/state/utils';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme"
import TablePagination from "src/sections/components/table-pagination-pages";
import {LocalHighlighter} from 'src/sections/components/local-highlighter';
import TableSorterHeader from "src/sections/components/table-sorter-header";
import {TableFilterHeader} from "src/layouts/app/table-filter-header/table-filter-header";
import XPathElements from "../xpath-validation-report/xpath-elements";

const Condition = ({text, value, na = false}) => {
    const color = value ? (na ? 'black' : 'green') : 'red'
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
        sectionApi,
        isResultSortable = true
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
                            <TableCell width='30%'>
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="xpath_condition_query"
                                                   title="XPath Condition"/>
                            </TableCell>
                            <TableCell width='30%'>
                                <SorterHeader fieldName="description"
                                              title=""/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="query"
                                              title="Query"/>
                            </TableCell>
                            <TableCell align="left">
                                {isResultSortable ? <SorterHeader fieldName="result"
                                                                  title="result"/> : 'Result'}
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
                                    <TableCell width='30%'>
                                        <>
                                            <Stack
                                                direction="column"
                                                spacing={1}
                                            >
                                                <Stack
                                                    direction="row"
                                                    justifyContent="left"
                                                    alignItems="center"
                                                    spacing={2}
                                                >
                                                    <LocalHighlighter language="xquery"
                                                                      text={item?.xpath_condition?.xpath_condition || '-'}
                                                                      width='400px'
                                                                      style={syntaxHighlighterTheme}/>
                                                    <Box sx={{p: 1}}>
                                                        {item?.xpath_condition?.xpath_condition ?
                                                            <>{item?.meets_xpath_condition ?
                                                                <CheckIcon color="success"/> :
                                                                <CloseIcon color="error"/>
                                                            }</> : <b>N/A</b>
                                                        }
                                                    </Box>
                                                </Stack>
                                            </Stack>
                                            <Divider sx={{my: 1}}/>
                                        </>

                                        <Stack
                                            direction="row"
                                            justifyContent="left"
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            <Scrollbar sx={{overflowX: 'auto', width: '350px', pb: 1}}>
                                                <Typography variant="subtitle3">
                                                    {item.element_xpath}
                                                </Typography>
                                            </Scrollbar>
                                            {item?.element_xpath && <CopyButton text={item.element_xpath}
                                                                                title="Copy XPATH to clipboard"/>}
                                            {item?.test_data && item.test_data.xpaths && item.test_data.xpaths.length > 0 &&
                                                <Box align="left">
                                                    <XPathElements element_id={item.sdk_element_id}
                                                                   element_xpath={item.element_xpath}
                                                                   test_data_xpaths={[item.test_data]}/>
                                                </Box>
                                            }
                                        </Stack>
                                    </TableCell>
                                    <TableCell width='30%'>
                                        <LocalHighlighter language="sparql"
                                                          style={syntaxHighlighterTheme}
                                                          text={item.query}/>
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
                                                       value={item?.xpath_condition?.xpath_condition ? item?.meets_xpath_condition : 'N/A'}
                                                       na={!item?.xpath_condition?.xpath_condition}
                                            />
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
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
