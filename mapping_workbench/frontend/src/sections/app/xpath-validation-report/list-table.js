import {useState} from "react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import PropTypes from 'prop-types';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import {Box} from "@mui/system";
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import {Scrollbar} from 'src/components/scrollbar';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import TableSorterHeader from "src/sections/components/table-sorter-header";
import TablePagination from "src/sections/components/table-pagination-pages";
import {TableFilterHeader} from "src/layouts/app/table-filter-header/table-filter-header";
import {getValidationColor} from '../mapping-package/state/utils';
import {ValueChip} from './utils';

export const ListTable = (props) => {
    const highLighterTheme = useHighlighterTheme()
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
        sort,
        onFilter,
        filters
    } = props;

    const [descriptionDialog, setDescriptionDialog] = useState({open: false, title: "", description: ""})

    const handleClose = () => setDescriptionDialog(e => ({...e, open: false}));

    const handleOpenDetails = (title, notices) => {
        const description = notices.map((notice, i) =>
            <Box key={'notice' + i}>
                <Button type='link'
                        onClick={() => handleSelectFile(notice.test_data_suite_oid)}
                >
                    {notice.test_data_suite_id}
                </Button>
                {' / '}
                <Button type='link'
                        onClick={() => handleSelectFile(notice.test_data_suite_oid, notice.test_data_oid)}
                >
                    {notice.test_data_id}
                </Button>
            </Box>)

        setDescriptionDialog({open: true, title, description});
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
                                    <TableFilterHeader sort={sort}
                                                       onSort={onSort}
                                                       onFilter={onFilter}
                                                       filters={filters}
                                                       fieldName="sdk_element_id"
                                                       title="Field"/>
                                </TableCell>
                                <TableCell>
                                    <TableFilterHeader sort={sort}
                                                       onSort={onSort}
                                                       onFilter={onFilter}
                                                       filters={filters}
                                                       fieldName="sdk_element_xpath"
                                                       title="XPath"/>
                                </TableCell>
                                <TableCell align="left">
                                    <SorterHeader fieldName="xpath_condition"
                                                  title="XPath Condition"/>
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
                                            <SyntaxHighlighter
                                                language="xquery"
                                                wrapLines
                                                style={highLighterTheme}
                                                customStyle={{borderRadius: 12, border: '1px solid #E4E7EC'}}
                                                lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                                                {item.sdk_element_xpath}
                                            </SyntaxHighlighter>
                                        </TableCell>
                                        <TableCell>
                                            {item.xpath_conditions?.map((xpath_condition, key) =>
                                                <Stack
                                                    key={'condition' + key}
                                                    direction="column"
                                                    spacing={1}
                                                >
                                                    <SyntaxHighlighter
                                                        language="xquery"
                                                        wrapLines
                                                        style={highLighterTheme}
                                                        customStyle={{
                                                            borderRadius: 12,
                                                            border: '1px solid',
                                                            borderColor: getValidationColor(xpath_condition.meets_xpath_condition ?
                                                                'valid' : 'invalid')
                                                        }}
                                                        lineProps={{
                                                            style: {
                                                                wordBreak: 'break-all',
                                                                whiteSpace: 'pre-wrap'
                                                            }
                                                        }}>
                                                        {xpath_condition.xpath_condition || '-'}
                                                    </SyntaxHighlighter>
                                                </Stack>)}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant='contained'
                                                    sx={{borderRadius: 10, p: .3, minWidth: 30}}
                                                    disabled={!item.notice_count}
                                                    onClick={() => handleOpenDetails(item.sdk_element_id, item.test_data_xpaths)}>
                                                {item.notice_count}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {item.is_covered ? <ValueChip color='success'
                                                                          style={{p: 0.3, width: 30}}>
                                                    <CheckIcon/>
                                                </ValueChip> :
                                                <ValueChip color='error'
                                                           style={{p: 0.3, width: 30}}>
                                                    <CloseIcon/>
                                                </ValueChip>}
                                        </TableCell>
                                    </TableRow>

                                );
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TablePagination>
            <Dialog
                open={descriptionDialog.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {descriptionDialog.title}
                </DialogTitle>
                <DialogContent>
                    {descriptionDialog.description}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
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
