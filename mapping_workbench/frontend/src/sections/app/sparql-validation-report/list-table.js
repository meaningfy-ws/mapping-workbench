import {useState} from "react";
import PropTypes from 'prop-types';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

import {Box} from "@mui/system";
import Table from '@mui/material/Table';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import {ResultChip} from "./utils";
import {codeStyle} from "src/utils/code-style";
import {Scrollbar} from 'src/components/scrollbar';
import TablePagination from "src/sections/components/table-pagination";
import TableSorterHeader from "src/sections/components/table-sorter-header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {useDialog} from "../../../hooks/use-dialog";
import Divider from "@mui/material/Divider";
import Slack from "next-auth/providers/slack";

export const ListTable = (props) => {
    const [descriptionDialog, setDescriptionDialog] = useState({open: false, title: "", description: ""})

    const {
        count = 0,
        items = [],
        onPageChange,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sort,
        onSort,
        sectionApi,
        handleSelectFile
    } = props;

    const handleOpenDetails = ({title, notices}) => {
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

    const handleClose = () => {
        setDescriptionDialog(e => ({...e, open: false}));
    };

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableSorterHeader sort={{direction, column: sort.column}}
                               onSort={onSort}
                               {...props}
            />
        )
    }

    const ResultCell = ({title, result, onClick}) => {
        return <Stack direction="column"
                      alignItems="center"
                      justifyContent="start"
                      height={100}>
            {result.count
                ? <Button variant="outlined"
                          onClick={() => onClick({title, notices: result.test_datas})}>
                    {result.count}
                </Button>
                : <Box sx={{mt: '10px'}}>{result.count}</Box>}
        </Stack>
    }

    const xpathConditionDialog = useDialog()

    const openXPathConditionDialog = (data) => {
        xpathConditionDialog.handleOpen(data)
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
                                    <SorterHeader fieldName="title"
                                                  title="Field"/>
                                </TableCell>
                                <TableCell width="15%">
                                    <SorterHeader fieldName="xpath_condition"
                                                  title="XPath Condition"/>
                                </TableCell>
                                <TableCell>
                                    <SorterHeader fieldName="query"
                                                  title="Query"/>
                                </TableCell>
                                <TableCell align="center">
                                    <SorterHeader fieldName="validCount"
                                                  title={<ResultChip label="Valid"
                                                                     clickable/>}
                                                  desc/>
                                </TableCell>
                                <TableCell align="center">
                                    <SorterHeader fieldName="unverifiableCount"
                                                  title={<ResultChip label="Unverifiable"
                                                                     clickable/>}
                                                  desc/>
                                </TableCell>
                                <TableCell align="center">
                                    <SorterHeader fieldName="warningCount"
                                                  title={<ResultChip label="Warning"
                                                                     clickable/>}
                                                  desc/>
                                </TableCell>
                                <TableCell align="center">
                                    <SorterHeader fieldName="invalidCount"
                                                  title={<ResultChip label="Invalid"
                                                                     clickable/>}
                                                  desc/>
                                </TableCell>
                                <TableCell align="center">
                                    <SorterHeader fieldName="errorCount"
                                                  title={<ResultChip label="Error"
                                                                     clickable/>}
                                                  desc/>
                                </TableCell>
                                <TableCell align="center">
                                    <SorterHeader fieldName="unknownCount"
                                                  title={<ResultChip label="Unknown"
                                                                     clickable/>}
                                                  desc/>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items?.map((item, i) => {
                                return (
                                    <TableRow key={'row' + i}>
                                        <TableCell width="25%">
                                            <Typography variant="subtitle3">
                                                {item.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item?.xpath_condition?.xpath_condition &&
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
                                                        <Button variant="text" type='link'
                                                                onClick={() => openXPathConditionDialog(item)}
                                                        >XQuery</Button>
                                                        {item?.xpath_condition?.meets_xpath_condition ?
                                                            <CheckIcon color="success"/> :
                                                            <CloseIcon color="error"/>}
                                                    </Stack>
                                                </Stack>}
                                        </TableCell>
                                        <TableCell>
                                            <SyntaxHighlighter
                                                language="sparql"
                                                wrapLines
                                                style={codeStyle}
                                                lineProps={{
                                                    style: {
                                                        overflowWrap: 'break-word',
                                                        whiteSpace: 'pre-wrap'
                                                    }
                                                }}>
                                                {item.query}
                                            </SyntaxHighlighter>
                                        </TableCell>
                                        <TableCell>
                                            <ResultCell
                                                title={item.title}
                                                result={item.result.valid}
                                                onClick={handleOpenDetails}/>
                                        </TableCell>
                                        <TableCell>
                                            <ResultCell
                                                title={item.title}
                                                result={item.result.unverifiable}
                                                onClick={handleOpenDetails}/>
                                        </TableCell>
                                        <TableCell>
                                            <ResultCell
                                                title={item.title}
                                                result={item.result.warning}
                                                onClick={handleOpenDetails}/>
                                        </TableCell>
                                        <TableCell>
                                            <ResultCell
                                                title={item.title}
                                                result={item.result.invalid}
                                                onClick={handleOpenDetails}/>
                                        </TableCell>
                                        <TableCell>
                                            <ResultCell
                                                title={item.title}
                                                result={item.result.error}
                                                onClick={handleOpenDetails}/>
                                        </TableCell>
                                        <TableCell>
                                            <ResultCell
                                                title={item.title}
                                                result={item.result.unknown}
                                                onClick={handleOpenDetails}/>
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
            <Dialog
                open={xpathConditionDialog.open}
                onClose={xpathConditionDialog.handleClose}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle>
                    XPath Condition for "{xpathConditionDialog.data?.title}"
                </DialogTitle>
                <DialogContent>
                    <SyntaxHighlighter
                        language="xquery"
                        wrapLines
                        style={codeStyle}
                        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                        {xpathConditionDialog.data?.xpath_condition?.xpath_condition}
                    </SyntaxHighlighter>
                    <Divider sx={{my: 1}}/>
                    <Stack direction="row">
                        {xpathConditionDialog.data?.xpath_condition?.meets_xpath_condition ?
                            <><CheckIcon color="success"/> - At least one Test Data meets this XPath Condition</> :
                            <><CloseIcon color="error"/> -  No Test Data meets this XPath Condition</>}
                    </Stack>

                </DialogContent>
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
