import {useState} from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

import {Scrollbar} from 'src/components/scrollbar';
import PropTypes from 'prop-types';
import Chip from "@mui/material/Chip";
import {resultColor} from "./utils";

export const ListTableFile = (props) => {
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

    const handleOpenDescription = ({title, description}) => {
        setDescriptionDialog({open: true, title, description});
    };

    const handleOpenDetails = ({title, query, query_result}) => {
        const description = <><li>{`Query result: ${query_result}`}</li><li>{query}</li></>
        setDescriptionDialog({open: true, title, description});
    }

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
            />
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell width="25%">
                                <SorterHeader fieldName="title"
                                              title="Form Field"/>
                            </TableCell>
                            <TableCell>
                                Description
                            </TableCell>
                            <TableCell>
                                 <SorterHeader fieldName="query"
                                               title="Query content"/>
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
                                    <TableCell width="25%">
                                        <Typography variant="subtitle3">
                                            {item.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outlined"
                                                onClick={() => handleOpenDescription(item)}>
                                            Description
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {item.query}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Chip label={item.result}
                                              color={resultColor(item.result)}/>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Button variant="outlined"
                                                onClick={() => handleOpenDetails(item)}>
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>

                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />
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

ListTableFile.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
