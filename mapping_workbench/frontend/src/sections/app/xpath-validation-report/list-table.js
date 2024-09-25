import {useState} from "react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

import PropTypes from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import Table from '@mui/material/Table';
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

import {Scrollbar} from 'src/components/scrollbar';
import TablePagination from "src/sections/components/table-pagination";
import TableSorterHeader from "src/sections/components/table-sorter-header";

export const ListTable = (props) => {

    const {
        count = 0,
        items = [],
        onPageChange,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi,
        handleSelectFile,
        onSort,
        sort
    } = props;

    const [popover, setPopover] = useState({})

    const setPopoverOpen = (item, anchor) => {
        setPopover({data: item, anchor})
    }

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
                                <TableCell width="25%">
                                    <SorterHeader fieldName="sdk_element_id"
                                                  title="Field"/>
                                </TableCell>
                                <TableCell>
                                    <SorterHeader fieldName="sdk_element_xpath"
                                                  title="XPath"/>
                                </TableCell>
                                <TableCell width="10%">
                                    <SorterHeader fieldName="notice_count"
                                                  title="Notices"/>
                                </TableCell>
                                <TableCell width="10%">
                                    <SorterHeader fieldName="is_covered"
                                                  title="Found"/>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items?.map((item, key) => {
                                return (
                                    <TableRow key={key}>
                                        <TableCell width="25%">
                                            <Typography variant="subtitle3">
                                                {item.sdk_element_id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                <SyntaxHighlighter
                                                    language="xquery"
                                                    wrapLines
                                                    lineProps={{
                                                        style: {
                                                            wordBreak: 'break-all',
                                                            whiteSpace: 'pre-wrap'
                                                        }
                                                    }}>
                                                    {item.sdk_element_xpath}
                                                </SyntaxHighlighter>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Button variant='outlined'
                                                    disabled={!item.notice_count}
                                                    onClick={(e) => setPopoverOpen(item, e.currentTarget)}>
                                                {item.notice_count}
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.is_covered ? <CheckIcon color="success"/> :
                                                <CloseIcon color="error"/>}
                                        </TableCell>
                                    </TableRow>

                                );
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TablePagination>
            <Popover
                id={'popover'}
                open={!!popover.anchor}
                anchorEl={popover.anchor}
                onClose={() => setPopover({})}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {popover.data?.test_data_xpaths?.map((e, i) =>
                    <Button type='link'
                            key={'id' + i}
                            onClick={() => handleSelectFile(e.test_data_oid, e.test_data_suite_oid)}>
                        {e.test_data_id}
                    </Button>)}
            </Popover>
        </>
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
