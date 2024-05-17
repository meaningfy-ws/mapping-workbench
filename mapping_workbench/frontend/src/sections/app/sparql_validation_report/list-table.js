import {useState} from "react";
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";

import {Scrollbar} from 'src/components/scrollbar';
import {ResultChip} from "./utils";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import TablePagination from "../../components/table-pagination";

export const ListTable = (props) => {
    const [descriptionDialog, setDescriptionDialog] = useState({open:false, title:"", description:""})

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

    const SorterHeader = ({fieldName, title, desc}) => {
        return <Tooltip enterDelay={300}
                       title="Sort"
               >
                   <TableSortLabel
                        active={sort.column === fieldName}
                        direction={sort.direction}
                        onClick={() => onSort(fieldName, desc)}>
                        {title ?? fieldName}
                    </TableSortLabel>
               </Tooltip>
    }

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
                                <TableCell width="25%">
                                    <SorterHeader fieldName="title"
                                                  title="Field"/>
                                </TableCell>
                                <TableCell>
                                     <SorterHeader fieldName="test_suite"
                                                   title="Test Suite"/>
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
                                            {item.test_suite}
                                        </TableCell>
                                        <TableCell>
                                            <SyntaxHighlighter
                                                language="sparql"
                                                wrapLines={true}
                                                lineProps={{ style: { overflowWrap: 'break-word', whiteSpace: 'pre-wrap' } }}>
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
