import {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import nl2br from "src/utils/nl2br";
import {Scrollbar} from 'src/components/scrollbar';
import timeTransformer from "src/utils/time-transformer";
import {useGlobalState} from "src/hooks/use-global-state";
import {SeverityPill} from "src/components/severity-pill";
import TablePagination from "src/sections/components/table-pagination";
import TableSorterHeader from "src/sections/components/table-sorter-header";
import {TaskActions, TaskLine} from "./task-actions";


export const taskStatuses = {
    QUEUED: "QUEUED",
    RUNNING: "RUNNING",
    FINISHED: "FINISHED",
    TIMEOUT: "TIMEOUT",
    FAILED: "FAILED",
    CANCELED: "CANCELED"
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
        onCancelAction,
        onDeleteAction
    } = props;


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

    // const MapStatusIcon = ({task_status}) => {
    //     const color = mapStatusColor(task_status)
    //     switch (task_status) {
    //         case taskStatuses.RUNNING:
    //             return <RadioButtonCheckedIcon color={color}/>
    //         case taskStatuses.FINISHED:
    //             return <CheckCircleOutlineIcon color={color}/>
    //         case taskStatuses.TIMEOUT:
    //         case taskStatuses.FAILED:
    //         case taskStatuses.CANCELED:
    //             return <CancelIcon color={color}/>
    //         default:
    //             return <InfoIcon color={color}/>
    //     }
    // }


    const [currentItem, setCurrentItem] = useState(null);
    const [popoverShow, setPopoverShow] = useState({})
    const {timeSetting} = useGlobalState()

    const handleItemToggle = itemId => setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableSorterHeader sort={{direction, column: sort.column}}
                               onSort={onSort}
                               {...props}
            />
        )
    }

    SorterHeader.propTypes = {
        fieldName: PropTypes.string
    }

    const handlePopoverEnter = (event, item) => {
        item?.progress?.actions?.length > 0 && setPopoverShow({anchor: event.currentTarget, item})
    }

    const handlePopoverLeave = () => {
        setPopoverShow(e => ({...e, anchor: undefined}))
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
                            <TableCell/>
                            <TableCell width="25%">
                                <SorterHeader fieldName="task_name"
                                              title='Title'/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="created_at"
                                              title='Created at'/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="stated_at"
                                              title='Start Time'/>
                            </TableCell>
                            <TableCell>
                                Started By
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="finished_at"
                                              title='Finished At'/>
                            </TableCell>
                            <TableCell>
                                Duration
                            </TableCell>
                            <TableCell width={200}>
                                <SorterHeader fieldName="task_status"
                                              title='Status'/>
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
                                    <TableRow hover
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
                                            {(item.exception_message || !!item.warnings?.length) &&
                                                <IconButton onClick={() => handleItemToggle(item_id)}>
                                                    <SvgIcon sx={{
                                                        transform: isCurrent ? 'rotate(90deg)' : '',
                                                        transition: '0.2s linear'
                                                    }}>
                                                        <ChevronRightIcon/>
                                                    </SvgIcon>
                                                </IconButton>}
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
                                            {item?.created_by}
                                        </TableCell>
                                        <TableCell>
                                            {timeTransformer(item.finished_at, timeSetting)}
                                        </TableCell>
                                        <TableCell>
                                            {item?.finished_at ? moment.utc(moment(item?.finished_at).diff(moment(item?.started_at))).format("HH:mm:ss") : '-'}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Stack onMouseEnter={(event) => handlePopoverEnter(event, item)}
                                                   onMouseLeave={handlePopoverLeave}>
                                                <SeverityPill color={mapStatusColor(item?.task_status)}>
                                                    {item?.task_status}
                                                </SeverityPill>
                                                <TaskLine item={item}/>
                                            </Stack>
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
                                                colSpan={9}
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
                                                        {item.exception_message && <>
                                                            <Typography sx={{pl: 3, pt: 1}}
                                                                        variant="h6"
                                                                        color="error">
                                                                Message
                                                            </Typography>
                                                            <Divider/>
                                                            <Typography sx={{pl: 3}}>
                                                                {nl2br(item.exception_message)}
                                                            </Typography>
                                                        </>}
                                                        {!!item.warnings?.length &&
                                                            <>
                                                                <Typography sx={{pl: 3, pt: 1}}
                                                                            variant="h6"
                                                                            color="orange">
                                                                    Warning
                                                                </Typography>
                                                                <Divider/>
                                                                <List sx={{pl: 3}}>
                                                                    {item.warnings.map((warning, key) =>
                                                                        <ListItem
                                                                            key={'warning' + key}>
                                                                            {warning}
                                                                        </ListItem>
                                                                    )}
                                                                </List>
                                                            </>}
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
                <Popover
                    id="mouse-over-popover"
                    sx={{pointerEvents: 'none'}}
                    open={!!popoverShow?.anchor}
                    anchorEl={popoverShow?.anchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={handlePopoverLeave}
                    disableRestoreFocus
                >
                    <TaskActions item={popoverShow?.item}/>
                </Popover>
            </Scrollbar>
        </TablePagination>
    );
};

ListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onSort: PropTypes.func,
    sort: PropTypes.object,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    sectionApi: PropTypes.object,
    onCancelAction: PropTypes.func,
    onDeleteAction: PropTypes.func
};

