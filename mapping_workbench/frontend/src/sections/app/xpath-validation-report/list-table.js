import {useState} from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
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
import DialogContentText from "@mui/material/DialogContentText";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import {Scrollbar} from 'src/components/scrollbar';
import PropTypes from 'prop-types';
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
        sectionApi,
        onSort,
        sort
    } = props;

    const handleClose = () => {
        setDescriptionDialog(e=>({...e, open: false}));
    };


    const SorterHeader = ({fieldName, title}) => {
       return <Tooltip enterDelay={300}
                       title="Sort"
               >
                   <TableSortLabel
                        active={sort.column === fieldName}
                        direction={sort.direction}
                        onClick={() => onSort(fieldName)}>
                        {title ?? fieldName}
                    </TableSortLabel>
               </Tooltip>
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
                                const notices = item.test_data_xpaths.map(e=> `"${e.test_data_id}":${e.xpaths.length}`)
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
                                                    wrapLines={true}
                                                    lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}>
                                                    {item.sdk_element_xpath}
                                                </SyntaxHighlighter>
                                            }
                                        </TableCell>
                                         <TableCell>
                                             <Accordion
                                                disabled={!item.notice_count}>
                                                 <AccordionSummary

                                                    expandIcon={<ExpandMoreIcon />}>
                                                    {item.notice_count}
                                                 </AccordionSummary>
                                                 <AccordionDetails>
                                                     {notices.join(',\n')}
                                                 </AccordionDetails>
                                             </Accordion>
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.is_covered ? <CheckIcon color="success"/> : <CloseIcon color="error"/>}
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
                  <DialogContentText id="alert-dialog-description">
                      {descriptionDialog.description}
                  </DialogContentText>
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
