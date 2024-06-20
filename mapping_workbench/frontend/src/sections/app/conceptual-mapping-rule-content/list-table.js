import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import TablePagination from "../../components/table-pagination";
import {useGlobalState} from "../../../hooks/use-global-state";
import timeTransformer from "../../../utils/time-transformer";
import TableSorterHeader from "../../components/table-sorter-header";
import Button from "@mui/material/Button";



export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {},
        onSort = () => {},
        sort,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi,
        onEdit
    } = props;

    const {timeSetting} = useGlobalState()


    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return(
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
                            <TableCell width="25%">
                                <SorterHeader fieldName="field_id"
                                              title="Field ID"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="field_label"
                                              title="Field Label"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="absolute_xpath"
                                              title="Absolute XPath"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="xpath_condition"
                                              title="XPath condition"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="ontology_class_path"
                                              title="Ontology Class Path"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="ontology_property_path"
                                              title="Ontology Property Path"/>
                            </TableCell>

                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => {
                            const item_id = item._id;

                            return (
                                    <TableRow hover
                                              key={item_id}>
                                        <TableCell
                                            width="25%"
                                        >
                                            <Typography variant="subtitle3">
                                                {item.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.description}
                                        </TableCell>
                                        <TableCell>
                                            {item.version}
                                        </TableCell>
                                        <TableCell align="left">
                                            {timeTransformer(item.created_at, timeSetting)}
                                        </TableCell>
                                        <TableCell/>
                                        <TableCell/>
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
                                            <ListItemActions
                                                onDeleteAction={() => projectStore.handleDeleteProject(item_id)}
                                                itemctx={new ForListItemAction(item_id, sectionApi)}/>
                                        </TableCell>
                                    </TableRow>
                            );
                        })}
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
    onEdit: PropTypes.func
};
