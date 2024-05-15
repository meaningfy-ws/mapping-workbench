import {useState} from 'react';
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

import {paths} from "src/paths";
import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import exportPackage from "../../../../utils/export-mapping-package";
import timeTransformer from "../../../../utils/time-transformer";
import {useGlobalState} from "../../../../hooks/use-global-state";

export const ListTable = (props) => {
    const {
        id,
        count = 0,
        items = [],
        page = 0,
        onPageChange,
        rowsPerPage = 0,
        onRowsPerPageChange,
        sortField,
        sortDirection,
        onSort,
        sectionApi
    } = props;

    const [isExporting, setIsExporting] = useState(false);
    const {timeSetting} = useGlobalState()
    const handleExport = item => {
        return exportPackage(sectionApi, id, setIsExporting, item)
    }

    const SorterHeader = ({fieldName, title}) => {
        return <Tooltip enterDelay={300}
                        title="Sort"
        >
            <TableSortLabel
                active={sortField === fieldName}
                direction={sortDirection > 0 ? "asc" : "desc"}
                onClick={() => onSort(fieldName)}>
                {title ?? fieldName}
            </TableSortLabel>
        </Tooltip>
    }

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
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell width="25%">
                                <SorterHeader fieldName="title"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="description"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="mapping_version"
                                              title="Version"/>
                            </TableCell>
                            <TableCell align="left">
                                <SorterHeader fieldName="created_at"
                                              title="Created"/>
                            </TableCell>
                            <TableCell align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map(item => {
                            const item_id = item._id;
                            return (
                                <TableRow key={item_id}>
                                    <TableCell width="25%">
                                        <Typography variant="subtitle3">
                                            {item.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {item.description}
                                    </TableCell>
                                    <TableCell>
                                        {item.mapping_version}
                                    </TableCell>
                                    <TableCell align="left">
                                        {timeTransformer(item.created_at, timeSetting)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <ListItemActions
                                                itemctx={new ForListItemAction(item_id, sectionApi)}
                                                pathnames={{
                                                    view: () => paths.app[sectionApi.section].states.view(id,item_id),
                                                }}
                                            />
                                            <Button
                                                onClick={() => handleExport(item)}
                                                disabled={isExporting}>
                                                {isExporting ? "Exporting..." : "Export"}
                                            </Button>
                                        </Stack>
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
        </div>
    );
};

ListTable.propTypes = {
    id: PropTypes.string,
    count: PropTypes.number,
    items: PropTypes.array,
    page: PropTypes.number,
    onPageChange: PropTypes.func,
    rowsPerPage: PropTypes.number,
    onRowsPerPageChange: PropTypes.func,
    sortField: PropTypes.string,
    sortDirection: PropTypes.number,
    onSort: PropTypes.func
};
