import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import PropTypes from 'prop-types';

import {Box} from "@mui/system";
import Chip from "@mui/material/Chip";
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

import {resultColor} from "./utils";
import {Scrollbar} from 'src/components/scrollbar';
import TablePagination from "src/sections/components/table-pagination";
import TableSorterHeader from "src/sections/components/table-sorter-header";
import Stack from "@mui/material/Stack";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableSorterHeader sort={{direction, column: sort.column}}
                               onSort={onSort}
                               {...props}
            />
        )
    }
    console.log(items);

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
                showFirstButton
                showLastButton
            >
                <Scrollbar>
                    <Table sx={{minWidth: 1200}}>
                        <TableHead>
                            <TableRow>
                                <TableCell width="15%">
                                    <SorterHeader fieldName="title"
                                                  title="Field"/>
                                </TableCell>
                                <TableCell align="left" width="35%">
                                    <SorterHeader fieldName="xpath_condition"
                                                  title="XPath Condition"/>
                                </TableCell>
                                <TableCell>
                                    <SorterHeader fieldName="description"
                                                  title="Description"/>
                                </TableCell>
                                <TableCell>
                                    <SorterHeader fieldName="query"
                                                  title="Query"/>
                                </TableCell>
                                <TableCell align="left">
                                    <SorterHeader fieldName="result"
                                                  title="result"/>
                                </TableCell>
                                <TableCell align="center">
                                    Details
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
                                            <Stack
                                                direction="column"
                                                spacing={1}
                                            >
                                                <Stack
                                                    direction="row"
                                                    justifyContent="right"
                                                    alignItems="center"
                                                    spacing={2}
                                                >
                                                    <SyntaxHighlighter
                                                        language="xquery"
                                                        wrapLines={true}
                                                        lineProps={{
                                                            style: {
                                                                wordBreak: 'break-all',
                                                                whiteSpace: 'pre-wrap'
                                                            }
                                                        }}>
                                                        {item?.xpath_condition?.xpath_condition || '-'}
                                                    </SyntaxHighlighter>
                                                    {item?.xpath_condition?.meets_xpath_condition ?
                                                        <CheckIcon color="success"/> :
                                                        <CloseIcon color="error"/>}
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>

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
                                            <Chip label={item.result}
                                                  color={resultColor(item.result)}/>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Box>
                                                <Typography>{`Query result: ${item.query_result}`}</Typography>
                                                <Typography>{`Fields covered: ${item.fields_covered}`}</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>

                                );
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TablePagination>
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
