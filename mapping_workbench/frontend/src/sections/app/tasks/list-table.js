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
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import {Scrollbar} from 'src/components/scrollbar';
import {SeverityPill} from "../../../components/severity-pill";
import TablePagination from "../../components/table-pagination";
import timeTransformer from "../../../utils/time-transformer";
import {useGlobalState} from "../../../hooks/use-global-state";

export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi,
        onCancelAction,
        onDeleteAction
    } = props;

    const taskStatuses = {
        QUEUED: "QUEUED",
        RUNNING: "RUNNING",
        FINISHED: "FINISHED",
        TIMEOUT: "TIMEOUT",
        FAILED: "FAILED",
        CANCELED: "CANCELED"
    }

    const mapStatusColor = (task_status) => {
        switch (task_status) {
            case taskStatuses.RUNNING:
                return "warning"
            case taskStatuses.FINISHED:
                return "success"
            case taskStatuses.TIMEOUT:
            case taskStatuses.FAILED:
            case taskStatuses.CANCELED:
                return "error"
            default:
                return "info"
        }
    }


    const [currentItem, setCurrentItem] = useState(null);
    const {timeSetting} = useGlobalState()

    const handleItemToggle = itemId => setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);


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
                            <TableCell/>
                            <TableCell width="25%">
                                Title
                            </TableCell>
                            <TableCell>
                                Created at
                            </TableCell>
                            <TableCell>
                                Start Time
                            </TableCell>
                            <TableCell>
                                Started By
                            </TableCell>
                            <TableCell>
                                Finished At
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => {
                            const item_id = item.task_id;
                            const isCurrent = item_id === currentItem;

                            return (
                                <Fragment key={item_id}>
                                    <TableRow
                                        hover
                                        key={item_id}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            sx={{
                                                ...(isCurrent && {
                                                    position: 'relative',
                                                    '&:after': {
                                                        position: 'absolute',
                                                        content: '" "',
                                                        top: 0,
                                                        left: 0,
                                                        backgroundColor: 'primary.main',
                                                        width: 3,
                                                        height: 'calc(100% + 1px)'
                                                    }
                                                })
                                            }}
                                            width="25%"
                                        >
                                            <IconButton onClick={() => handleItemToggle(item_id)}>
                                                <SvgIcon>
                                                    {isCurrent ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                                                </SvgIcon>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell width="25%">
                                            <Typography variant="subtitle3">
                                                {item.task_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {timeTransformer(item.created_at, timeSetting)}
                                        </TableCell>
                                        <TableCell>
                                            {timeTransformer(item.started_at, timeSetting)}
                                        </TableCell>
                                        <TableCell>
                                            {item.started_by}
                                        </TableCell>
                                        <TableCell>
                                            {timeTransformer(item.finished_at, timeSetting)}
                                        </TableCell>
                                        <TableCell align="left">
                                            <SeverityPill color={mapStatusColor(item.task_status)}>
                                                {item.task_status}
                                            </SeverityPill>
                                        </TableCell>
                                        <TableCell align="right">
                                            {[taskStatuses.QUEUED, taskStatuses.RUNNING].includes(item.task_status)
                                                && <Button
                                                    id="cancel_button"
                                                    variant="text"
                                                    size="small"
                                                    color="warning"
                                                    onClick={() => onCancelAction(item_id)}
                                                >
                                                    Cancel
                                                </Button>
                                            }
                                            <Button
                                                id="delete_button"
                                                variant="text"
                                                size="small"
                                                color="error"
                                                onClick={() => onDeleteAction(item_id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {isCurrent && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                sx={{
                                                    p: 0,
                                                    position: 'relative',
                                                    '&:after': {
                                                        position: 'absolute',
                                                        content: '" "',
                                                        top: 0,
                                                        left: 0,
                                                        backgroundColor: 'primary.main',
                                                        width: 3,
                                                        height: 'calc(100% + 1px)'
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        direction="column"
                                                        gap={3}
                                                    >
                                                        <Typography sx={{paddingLeft: "24px"}}
                                                                    variant="h6">
                                                            Exception message
                                                        </Typography>
                                                        <Divider/>
                                                        <Typography sx={{paddingLeft: "24px"}}>
                                                            {item.exception_message}
                                                        </Typography>
                                                    </Grid>
                                                </CardContent>
                                                <Divider/>
                                            </TableCell>
                                        </TableRow>
                                    )}
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
