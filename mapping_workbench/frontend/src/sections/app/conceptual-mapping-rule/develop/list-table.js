import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {Scrollbar} from 'src/components/scrollbar';
import TablePagination from "../../../components/table-pagination";
import {useGlobalState} from "../../../../hooks/use-global-state";
import TableSorterHeader from "../../../components/table-sorter-header";
import Button from "@mui/material/Button";
import {useState} from "react";
import ConfirmDialog from "../../../../components/app/dialog/confirm-dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import {useDialog} from "../../../../hooks/use-dialog";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {codeStyle} from "../../../../utils/code-style";


export const ListTableRow = (props) => {
    const {
        item,
        onEdit,
        onDelete
    } = props;

    const xpathConditionDialog = useDialog()

    const [confirmOpen, setConfirmOpen] = useState(false);

    const openXPathConditionDialog = () => {
        xpathConditionDialog.handleOpen({})
    }

    return (
        <>
            <TableRow hover>
                <TableCell
                    width="10%"
                >
                    <Typography variant="subtitle3">
                        {item.source_structural_element_sdk_element_id}
                    </Typography>
                </TableCell>
                <TableCell
                    sx={{
                        wordBreak: "break-all"
                    }}
                >
                    <SyntaxHighlighter
                        language="xquery"
                        wrapLines
                        style={codeStyle}
                        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                        {item.source_structural_element_absolute_xpath}
                    </SyntaxHighlighter>
                </TableCell>
                <TableCell>
                    {item.xpath_condition &&
                        <Button variant="text" type='link' onClick={openXPathConditionDialog}>XQuery</Button>}
                </TableCell>
                <TableCell>
                    {item.min_sdk_version}
                </TableCell>
                <TableCell>
                    {item.max_sdk_version}
                </TableCell>
                <TableCell>
                    {item.target_class_path}
                </TableCell>
                <TableCell>
                    {item.target_property_path}
                </TableCell>
                <TableCell align="right">
                    <Button
                        id="edit_button"
                        variant="text"
                        size="small"
                        color="primary"
                        onClick={() => onEdit(item)}
                    >
                        Edit
                    </Button>
                    <Button
                        id="delete_button"
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => setConfirmOpen(true)}
                        sx={{
                            whiteSpace: "nowrap"
                        }}
                    >
                        Delete
                    </Button>
                    <ConfirmDialog
                        title="Delete It?"
                        open={confirmOpen}
                        setOpen={setConfirmOpen}
                        onConfirm={() => onDelete(item)}
                    >
                        Are you sure you want to delete it?
                    </ConfirmDialog>
                </TableCell>
            </TableRow>
            <Dialog
                open={xpathConditionDialog.open}
                onClose={xpathConditionDialog.handleClose}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle>
                    XPath Condition
                </DialogTitle>
                <DialogContent>
                    <SyntaxHighlighter
                        language="xquery"
                        wrapLines
                        style={codeStyle}
                        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                        {item.xpath_condition}
                    </SyntaxHighlighter>
                </DialogContent>
            </Dialog>
        </>
    );
}
export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onSort = () => {
        },
        sort,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi,
        onEdit,
        onDelete
    } = props;

    const {timeSetting} = useGlobalState()


    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableSorterHeader sort={{direction, column: sort.column}}
                               onSort={onSort}
                               {...props}
            />
        )
    }

    return (
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
                            <TableCell width="10%">
                                <SorterHeader fieldName="source_structural_element_sdk_element_id"
                                              title="Field ID"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="source_structural_element_absolute_xpath"
                                              title="Absolute XPath"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="xpath_condition"
                                              title="XPath condition"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="min_sdk_version"
                                              title="Min XSD"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="max_sdk_version"
                                              title="Max XSD"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="target_class_path"
                                              title="Ontology Class Path"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="target_property_path"
                                              title="Ontology Property Path"/>
                            </TableCell>

                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => <ListTableRow
                            key={item._id}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />)}
                    </TableBody>
                </Table>
            </Scrollbar>
        </TablePagination>
    );

};

ListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};
