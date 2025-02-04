import {useState} from "react";
import PropTypes from 'prop-types';

import {Box} from "@mui/system";
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import {ResultChip} from "./utils";
import {Scrollbar} from 'src/components/scrollbar';
import {ValueChip} from '../xpath-validation-report/utils';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import SorterHeader from 'src/sections/components/table-sorter-header';
import TablePagination from "src/sections/components/table-pagination";
import {LocalHighlighter} from 'src/sections/components/local-highlighter';
import TableSorterHeader from "src/sections/components/table-sorter-header";
import {TableFilterHeader} from "src/layouts/app/table-filter-header/table-filter-header";

export const ListTable = (props) => {
    const [descriptionDialog, setDescriptionDialog] = useState({open: false, title: "", text: ""})
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

    const SorterHeader = (props) => <TableSorterHeader sort={sort}
                                                       onSort={onSort}
                                                       {...props}
    />


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
                        <ResultChip color={key}
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
                                <TableCell>
                                    <TableFilterHeader sort={sort}
                                                       onSort={onSort}
                                                       onFilter={onFilter}
                                                       filters={filters}
                                                       fieldName="shacl_suite"
                                                       title="Test Suite"/>
                                </TableCell>
                                <TableCell width="25%">
                                    <TableFilterHeader sort={sort}
                                                       onSort={onSort}
                                                       onFilter={onFilter}
                                                       filters={filters}
                                                       fieldName="short_source_constraint_component"
                                                       title="Constraint Type"/>
                                </TableCell>
                                <TableCell>
                                    <TableFilterHeader sort={sort}
                                                       onSort={onSort}
                                                       onFilter={onFilter}
                                                       filters={filters}
                                                       fieldName="short_result_path"
                                                       title="Result Path"/>
                                </TableCell>
                                <TableCell align='center'>
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
                            {items?.map((item, key) => {
                                return (
                                    <TableRow key={key}>
                                        <TableCell>
                                            {item.shacl_suite}
                                        </TableCell>
                                        <TableCell>
                                            <LocalHighlighter language='turtle'
                                                              text={item.short_source_constraint_component}
                                                              style={syntaxHighlighterTheme}/>
                                        </TableCell>
                                        <TableCell>
                                            <LocalHighlighter language='turtle'
                                                              text={item.short_result_path}
                                                              style={syntaxHighlighterTheme}/>
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
