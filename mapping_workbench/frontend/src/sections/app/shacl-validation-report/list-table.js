import {useEffect, useState} from "react";
import PropTypes from 'prop-types';

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
import {ResultCell} from '../mapping-package/state/utils';

import {Scrollbar} from 'src/components/scrollbar';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import SorterHeader from 'src/sections/components/table-sorter-header';
import TablePagination from "src/sections/components/table-pagination-pages";
import {LocalHighlighter} from 'src/sections/components/local-highlighter';
import TableSorterHeader from "src/sections/components/table-sorter-header";
import {TableFilterHeader} from "src/layouts/app/table-filter-header/table-filter-header";
import {useRouter} from "../../../hooks/use-router";
import CommentsIcon from "@mui/icons-material/CommentBankOutlined";
import ValidationCommentView from "../mapping-package/state/components/vcomment-view";
import {prepareExistingValidationComments} from "../mapping-package/state/validation/render-list-comments";

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
        handleSelectFile,
        updateItems = null,
        listItems = []
    } = props;

    const router = useRouter();
    const {id, sid, tab} = router.query;

    const [existingComments, setExistingComments] = useState({})
    const [existingCommentsReady, setExistingCommentsReady] = useState(false)
    const getExistingValidationComments = () => {
        prepareExistingValidationComments(sectionApi, sid, listItems, setExistingComments, setExistingCommentsReady, updateItems);
    }
    useEffect(() => {
        (!existingCommentsReady && listItems.length > 0) && getExistingValidationComments();
    }, [listItems, existingCommentsReady]);

    const handleClose = () => setDescriptionDialog(e => ({...e, open: false}));

    const SorterHeader = (props) => <TableSorterHeader sort={sort}
                                                       onSort={onSort}
                                                       {...props}
    />

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
                                <TableCell align="center">
                                    <SorterHeader fieldName="nb_comments"
                                                  title={<CommentsIcon/>}
                                                  defaultSortDirection="desc"
                                    />
                                </TableCell>
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
                                        <TableCell align="center">
                                            <ValidationCommentView
                                                state_id={sid}
                                                validation_element_id={item.validation_element_id}
                                                comments_count={existingComments[item.validation_element_id]}
                                                handleUpdate={getExistingValidationComments}
                                            />
                                        </TableCell>
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
                                                        handleSelect={handleSelectFile}
                                                        setDescription={setDescriptionDialog}/>
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
