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

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {paths} from "../../../../paths";
import {useRouter} from "../../../../hooks/use-router";
import {sessionApi} from "../../../../api/session";
import exportPackage from "../../../../utils/export-mapping-package";

export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = (item) => {
        return exportPackage(sectionApi, sessionApi.getSessionProject(), id, setIsExporting, item)
    }

    const router = useRouter();
    if (!router.isReady) return;

    const {id} = router.query;



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
                                <Tooltip enterDelay={300}
                                         title="Sort"
                                >
                                    <TableSortLabel direction="asc">
                                        Title
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
                                        Version
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
                                        Created
                                    </TableSortLabel>
                                </Tooltip>
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
                                        {(item.created_at).replace("T", " ").split(".")[0]}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <ListItemActions
                                                itemctx={new ForListItemAction(item_id, sectionApi)}
                                                pathnames={{
                                                    view: paths.app[sectionApi.section].states.view.replace("[id]",id).replace("[sid]",item_id),
                                                }}
                                                actions={{
                                                    delete: sectionApi.deleteState
                                                }}/>
                                            <Button
                                                onClick={()=>handleExport(item)}
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
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};