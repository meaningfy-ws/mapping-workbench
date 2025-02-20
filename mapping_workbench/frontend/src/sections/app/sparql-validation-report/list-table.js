import {useState} from "react";
import PropTypes from 'prop-types';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import {Box} from "@mui/system";
import Table from '@mui/material/Table';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import Divider from "@mui/material/Divider";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SorterHeader from '../../components/table-sorter-header';

import {ResultChip} from "./utils";
import {useDialog} from "src/hooks/use-dialog";
import {Scrollbar} from 'src/components/scrollbar';
import {ValueChip} from '../xpath-validation-report/utils';
import {getValidationColor} from '../mapping-package/state/utils';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import TablePagination from "src/sections/components/table-pagination-pages";
import {TableFilterHeader} from "src/layouts/app/table-filter-header/table-filter-header";

const ResultCell = ({item, onClick}) => {
    const title = item.title
    return <Stack direction="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  height={100}>
        {Object.entries(item.result).map(([key, value]) => {
            return value.count > 0
                ? <Stack direction='row'
                         key={key}
                         gap={1}>
                    <ValueChip value={value.count}
                               color='primary'
                               sx={{p: 2}}/>
                    <ResultChip color={getValidationColor(key)}
                                clickable
                                fontColor='#fff'
                                onClick={() => onClick({title, notices: value.test_datas})}
                                label={key}
                    />
                </Stack>
                : null
        })
        }
    </Stack>
}

export const ListTable = (props) => {
    const [descriptionDialog, setDescriptionDialog] = useState({open: false, title: "", description: ""})
    const syntaxHighlighterTheme = useHighlighterTheme()

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
        resultFilter,
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

    const handleClose = () => setDescriptionDialog(e => ({...e, open: false}));

    const xpathConditionDialog = useDialog()

    const openXPathConditionDialog = (data) => xpathConditionDialog.handleOpen(data)

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
                                                       fieldName="title"
                                                       title="Field"/>
                                </TableCell>
                                <TableCell width="15%">
                                    <TableFilterHeader sort={sort}
                                                       onSort={onSort}
                                                       onFilter={onFilter}
                                                       filters={filters}
                                                       fieldName="xpath_condition"
                                                       title="XPath Condition"/>
                                </TableCell>
                                <TableCell>
                                    <TableFilterHeader sort={sort}
                                                       onSort={onSort}
                                                       onFilter={onFilter}
                                                       filters={filters}
                                                       fieldName="query"
                                                       title="Query"/>
                                </TableCell>
                                <TableCell>
                                    {!!resultFilter ?
                                        <SorterHeader fieldName={resultFilter}
                                                      title='Result'
                                                      sort={sort}
                                                      onSort={onSort}/>
                                        : 'Result'
                                    }
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
                                                        <Button variant="text"
                                                                type='link'
                                                                onClick={() => openXPathConditionDialog(item)}>
                                                            XQuery
                                                        </Button>
                                                        {item?.xpath_condition?.meets_xpath_condition ?
                                                            <ValueChip color='success'
                                                                       style={{p: 0.3, width: 30}}>
                                                                <CheckIcon/>
                                                            </ValueChip> :
                                                            <ValueChip color='error'
                                                                       style={{p: 0.3, width: 30}}>
                                                                <CloseIcon/>
                                                            </ValueChip>}
                                                    </Stack>
                                                </Stack>}
                                        </TableCell>
                                        <TableCell>
                                            <SyntaxHighlighter
                                                language="sparql"
                                                wrapLines
                                                style={syntaxHighlighterTheme}
                                                customStyle={{borderRadius: 12, border: '1px solid #E4E7EC'}}
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
                                            <ResultCell item={item}
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
                    {`XPath Condition for "${xpathConditionDialog.data?.title}"`}
                </DialogTitle>
                <DialogContent>
                    <SyntaxHighlighter
                        language="xquery"
                        wrapLines
                        style={syntaxHighlighterTheme}
                        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                        {xpathConditionDialog.data?.xpath_condition?.xpath_condition}
                    </SyntaxHighlighter>
                    <Divider sx={{my: 1}}/>
                    <Stack direction="row">
                        {xpathConditionDialog.data?.xpath_condition?.meets_xpath_condition ?
                            <><CheckIcon color="success"/> - At least one Test Data meets this XPath Condition</> :
                            <><CloseIcon color="error"/> - No Test Data meets this XPath Condition</>}
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
