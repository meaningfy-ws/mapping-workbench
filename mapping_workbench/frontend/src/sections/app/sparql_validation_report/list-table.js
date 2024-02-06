import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {paths} from "../../../paths";
import {useRouter} from "../../../hooks/use-router";
import {useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {DialogContentText} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";

export const ListTable = (props) => {
    const [descriptionDialog, setDescriptionDialog] = useState({open:false,title:"",text:""})

    const {
        count = 0,
        items = [],
        onPageChange,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const router = useRouter();
    if (!router.isReady) return;

    const {id} = router.query;

    const handleClickOpen = ({title,description}) => {
        setDescriptionDialog({open:true,title,description});
    };

    const handleClose = () => {
        setDescriptionDialog(e=>({...e,open:false}));
    };

    return (
        <div>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />

{/*Form Field	Description	Query content	Result	Details*/}
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell width="25%">
                                <Tooltip enterDelay={300}
                                         title="Sort"
                                >
                                    <TableSortLabel direction="asc">
                                        Form Field
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                Description
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel direction="asc">
                                        Query content
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="left">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        active
                                        direction="desc"
                                    >
                                        Result
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                                Details
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, key)=> {
                            // const item_id = item._id;
                            return (
                                <TableRow key={key}>
                                    <TableCell width="25%">
                                        <Typography variant="subtitle3">
                                            {item.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outlined"
                                                onClick={() => handleClickOpen(item)}>
                                            Show Description
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {item.resultSeverity}
                                    </TableCell>
                                    <TableCell align="left">
                                        {item.sourceConstraintComponent}
                                    </TableCell>
                                    <TableCell align="left">
                                        {item.message}
                                    </TableCell>
                                    {/*<TableCell align="right">*/}
                                    {/*    <Stack*/}
                                    {/*        alignItems="center"*/}
                                    {/*        direction="row"*/}
                                    {/*    >*/}
                                    {/*        <ListItemActions*/}
                                    {/*            itemctx={new ForListItemAction(item_id, sectionApi)}*/}
                                    {/*            pathnames={{*/}
                                    {/*                view: paths.app[sectionApi.section].states.view.replace("[id]",id).replace("[sid]",item_id),*/}
                                    {/*            }}*/}
                                    {/*            actions={{*/}
                                    {/*                delete: sectionApi.deleteState*/}
                                    {/*            }}/>*/}
                                    {/*        <Button*/}
                                    {/*            onClick={()=>handleExport(item)}*/}
                                    {/*            disabled={isExporting}>*/}
                                    {/*            {isExporting ? "Exporting..." : "Export"}*/}
                                    {/*        </Button>*/}
                                    {/*    </Stack>*/}
                                    {/*</TableCell>*/}
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
        </div>
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
