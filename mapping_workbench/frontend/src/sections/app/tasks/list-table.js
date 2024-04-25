import {Fragment, useState} from 'react';
import {useRouter} from "next/router";
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
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import {Scrollbar} from 'src/components/scrollbar';
import {sessionApi} from "../../../api/session";
import {SeverityPill} from "../../../components/severity-pill";
import {paths} from "../../../paths";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";


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

    const router = useRouter();

    const [currentItem, setCurrentItem] = useState(null);

    const sessionProject = sessionApi.getSessionProject()

    const handleItemToggle = itemId => setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);

    const handleSelectAction = async (itemId, section) => {
            const toastId = toastLoad('Selecting project...');
            sessionApi.setSessionProject(itemId)
                .then(() => {
                    toastSuccess('Package selected', toastId)
                     router.push({
                         pathname: paths.app[section.section].view,
                         query: {id: itemId}
                    });
                    router.reload()
                })
                .catch(err => toastError(err, toastId))
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
                            <TableCell/>
                            <TableCell width="25%">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Title
                                    </TableSortLabel>
                                </Tooltip>
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
                            const isSessionProject = item_id === sessionProject
                            const statusColor = isSessionProject ? 'success' : 'primary';

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
                                            {item.started_at}
                                        </TableCell>
                                        <TableCell>
                                            {item.started_by}
                                        </TableCell>
                                          <TableCell>
                                            {item.finished_at}
                                        </TableCell>
                                        <TableCell align="left">
                                               <SeverityPill color={mapStatusColor(item.task_status)}>
                                                    {item.task_status}
                                                </SeverityPill>

                                            {/*{(item.created_at).replace("T", " ").split(".")[0]}*/}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                id="cancel_button"
                                                variant="text"
                                                size="small"
                                                color="error"
                                                onClick={() => handleSelectAction(item_id, sectionApi)}
                                            >
                                                Cancel
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {isCurrent && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
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
