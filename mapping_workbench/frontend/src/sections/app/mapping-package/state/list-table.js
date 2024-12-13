import {useState} from 'react';
import PropTypes from 'prop-types';

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

import {paths} from "src/paths";
import {Scrollbar} from 'src/components/scrollbar';
import timeTransformer from "src/utils/time-transformer";
import {useGlobalState} from "src/hooks/use-global-state";
import exportPackage from "src/utils/export-mapping-package";
import TablePagination from "src/sections/components/table-pagination";
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import TableSorterHeader from 'src/sections/components/table-sorter-header';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {MenuActionButton, MenuActions} from '../../../../components/menu-actions';

export const ListTable = (props) => {
    const {
        id,
        count = 0,
        items = [],
        page = 0,
        onPageChange,
        rowsPerPage = 0,
        onRowsPerPageChange,
        sort,
        onSort,
        sectionApi
    } = props;

    const [isExporting, setIsExporting] = useState(false);
    const {timeSetting} = useGlobalState()
    const handleExport = item => {
        return exportPackage(sectionApi, id, setIsExporting, item)
    }

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableCell>
                <TableSorterHeader sort={{direction, column: sort.column}}
                                   onSort={onSort}
                                   {...props}
                />
            </TableCell>
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
            <Paper>
                <Scrollbar>
                    <Table sx={{minWidth: 1200}}>
                        <TableHead>
                            <TableRow>
                                <SorterHeader width="25%"
                                              fieldName="title"/>
                                <SorterHeader fieldName="description"/>
                                <SorterHeader fieldName="mapping_version"
                                              title="Version"/>
                                <SorterHeader align="left"
                                              fieldName="created_at"
                                              title="Created"/>
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
                                                <MenuActions>
                                                    <ListItemActions
                                                        itemctx={new ForListItemAction(item_id, sectionApi)}
                                                        pathnames={{
                                                            view: () => paths.app[sectionApi.section].states.view(id, item_id),
                                                        }}
                                                    />
                                                    <MenuActionButton
                                                        onClick={() => handleExport(item)}
                                                        icon={<FileUploadOutlinedIcon/>}
                                                        // disabled={isExporting}>
                                                        text={isExporting ? "Exporting..." : "Export"}/>
                                                </MenuActions>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>

                                )
                                    ;
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </Paper>
        </TablePagination>
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
