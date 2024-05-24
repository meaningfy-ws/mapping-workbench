import {useState} from "react";
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";

import {Scrollbar} from 'src/components/scrollbar';
import {ResultChip, SorterHeader as UtilsSorterHeader} from "./utils";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import TablePagination from "../../components/table-pagination";

export const ListTable = (props) => {
    const [descriptionDialog, setDescriptionDialog] = useState({open:false, title:"", text:""})

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

    const mapNotices = (notices) => {
        return(
            <ul style={{listStyleType: "circle"}}>
                {notices.map((notice,i) =>
                    <li key={'notice' + i}>
                        {`${notice.test_data_suite_id} / ${notice.test_data_id}`}
                    </li>)}
            </ul>
        )
    }

    const handleOpenDetails = ({title, notices}) => {
        const description = mapNotices(notices)
        setDescriptionDialog({open: true, title, description});
    }

    const handleClose = () => {
        setDescriptionDialog(e=>({...e, open: false}));
    };

    const SorterHeader = (props) => <UtilsSorterHeader sort={sort}
                                                       onSort={onSort}
                                                       {...props}
                                                        />

    const ResultCell = ({title, result, onClick}) => {
        return <Stack direction="column"
        alignItems="center"
        justifyContent="start"
        height={100}>
                    {result.count}
                    {!!result.count && <Button variant="outlined"
                    onClick={()=> onClick({title, notices: result.test_datas})}>
                        Details
                    </Button>}
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
                                     <SorterHeader fieldName="test_suite"
                                                   title="Test Suite"/>
                                </TableCell>
                                <TableCell width="25%">
                                    <SorterHeader fieldName="conforms"
                                                  title="Conforms"/>
                                </TableCell>

                            <TableCell>
                                 <SorterHeader fieldName="short_result_path"
                                               title="Result Path"/>
                            </TableCell>
                            <TableCell align="center">
                                <SorterHeader fieldName="infoCount"
                                              title={<ResultChip label="Info"
                                                                 clickable/>}
                                              desc/>
                            </TableCell>
                            <TableCell align="center">
                                <SorterHeader fieldName="validCount"
                                              title={<ResultChip label="Valid"
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
                                 <SorterHeader fieldName="violationCount"
                                               title={<ResultChip label="Violation"
                                                                  clickable/>}
                                               desc/>
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
                                            {0}
                                    </TableCell>
                                    <TableCell>
                                        <SyntaxHighlighter
                                            language="turtle"
                                            wrapLines={true}
                                            lineProps={{ style: { overflowWrap: 'break-word', whiteSpace: 'pre-wrap' } }}>
                                            {item.short_result_path}
                                        </SyntaxHighlighter>
                                    </TableCell>
                                    <TableCell>
                                        <ResultCell
                                            title={item.title}
                                            result={item.result.info}
                                            onClick={handleOpenDetails}/>
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
                                            result={item.result.warning}
                                            onClick={handleOpenDetails}/>
                                    </TableCell>
                                    <TableCell>
                                        <ResultCell
                                            title={item.title}
                                            result={item.result.violation}
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
