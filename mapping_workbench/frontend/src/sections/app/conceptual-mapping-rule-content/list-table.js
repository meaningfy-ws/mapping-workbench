import {Fragment, useState} from 'react';
import PropTypes from 'prop-types';

import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {SeverityPill} from "../../../components/severity-pill";
import {useProjects} from "../../../hooks/use-projects";
import TablePagination from "../../components/table-pagination";
import {useGlobalState} from "../../../hooks/use-global-state";
import timeTransformer from "../../../utils/time-transformer";
import TableSorterHeader from "../../components/table-sorter-header";



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
        sectionApi
    } = props;

    const {timeSetting} = useGlobalState()

    const [currentItem, setCurrentItem] = useState(null);
    const projectStore = useProjects()

    const handleItemToggle = itemId => setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);

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
                            const isCurrent = item_id === currentItem;
                            const isSessionProject = item_id === projectStore.sessionProject
                            const statusColor = isSessionProject ? 'success' : 'primary';

                            return (
                                <Fragment key={item_id}>
                                    <TableRow hover>
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
                                                id="select_button"
                                                variant="text"
                                                size="small"
                                                color="warning"
                                                onClick={() => projectStore.handleSessionProjectChange(item_id)}
                                            >
                                                Select
                                            </Button>
                                            <ListItemActions
                                                onDeleteAction={() => projectStore.handleDeleteProject(item_id)}
                                                itemctx={new ForListItemAction(item_id, sectionApi)}/>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
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
    rowsPerPage: PropTypes.number
};
