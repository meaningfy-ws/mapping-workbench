import {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CommentsIcon from "@mui/icons-material/CommentBankOutlined";

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
import {getValidationColor, handleOpenDetails, ValueChip} from '../mapping-package/state/utils';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import {LocalHighlighter} from '../../components/local-highlighter';
import TablePagination from "src/sections/components/table-pagination-pages";
import TableSorterHeader from "src/sections/components/table-sorter-header";
import {TableFilterHeader} from "src/layouts/app/table-filter-header/table-filter-header";
import Box from "@mui/system/Box";
import XPathElements from "./xpath-elements";
import ValidationCommentView from "../mapping-package/state/components/vcomment-view";
import {useRouter} from "src/hooks/use-router";
import {
    prepareExistingValidationComments
} from "../mapping-package/state/validation/render-list-comments";

export const ListTable = (props) => {
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
        filters,
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

    const highLighterTheme = useHighlighterTheme()

    const [descriptionDialog, setDescriptionDialog] = useState({open: false, title: "", description: ""})

    const handleClose = () => setDescriptionDialog(e => ({...e, open: false}));

    const SorterHeader = (props) => {
        return (<TableSorterHeader sort={sort}
                                   onSort={onSort}
                                   {...props}
        />)
    }

    return (<>
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
                                                   fieldName="sdk_element_id"
                                                   title="Field"/>
                            </TableCell>
                            <TableCell width='30%'>
                                <TableFilterHeader sort={sort}
                                                   onSort={onSort}
                                                   onFilter={onFilter}
                                                   filters={filters}
                                                   fieldName="sdk_element_xpath"
                                                   title="XPath"/>
                            </TableCell>
                            <TableCell align="left">
                                XPath Condition
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="notice_count"
                                              title="Notices"
                                              defaultSortDirection="desc"
                                />
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="is_covered"
                                              title="Found"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, key) => {
                            return (<TableRow key={key}>
                                    <TableCell align="center">
                                        <ValidationCommentView
                                            state_id={sid}
                                            validation_element_id={item.validation_element_id}
                                            comments_count={existingComments[item.validation_element_id]}
                                            handleUpdate={getExistingValidationComments}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle3">
                                            {item.sdk_element_id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            direction="row"
                                            justifyContent="left"
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            <LocalHighlighter language="xquery"
                                                              theme={highLighterTheme}
                                                              text={item.sdk_element_xpath}
                                            />
                                            {item?.test_data_xpaths && item.test_data_xpaths.length > 0 &&
                                                <Box align="left">
                                                    <XPathElements element_id={item.sdk_element_id}
                                                                   element_xpath={item.sdk_element_xpath}
                                                                   test_data_xpaths={item.test_data_xpaths}/>
                                                </Box>}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {item.xpath_conditions?.map((xpath_condition, key) => <Stack
                                            key={'condition' + key}
                                            direction="column"
                                            spacing={1}
                                        >
                                            <LocalHighlighter language="xquery"
                                                              style={highLighterTheme}
                                                              customStyle={{
                                                                  borderRadius: 12,
                                                                  border: '1px solid',
                                                                  borderColor: getValidationColor(xpath_condition.meets_xpath_condition ? 'valid' : 'invalid')
                                                              }}
                                                              text={xpath_condition.xpath_condition || '-'}/>
                                        </Stack>)}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant='contained'
                                                sx={{borderRadius: 10, p: .3, minWidth: 30}}
                                                disabled={!item.notice_count}
                                                onClick={() => handleOpenDetails(item.sdk_element_id, item.test_data_xpaths, handleSelectFile, setDescriptionDialog)}>
                                            {item.notice_count}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {item.is_covered ? <ValueChip color='success'
                                                                      style={{p: 0.3, width: 30}}>
                                            <CheckIcon/>
                                        </ValueChip> : <ValueChip color='error'
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
    </>);
};

ListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
