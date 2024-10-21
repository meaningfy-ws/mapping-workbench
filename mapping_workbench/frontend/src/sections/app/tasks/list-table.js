import {Fragment, useState} from 'react';
import PropTypes from 'prop-types';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
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

import {Scrollbar} from 'src/components/scrollbar';
import {SeverityPill} from "../../../components/severity-pill";
import TablePagination from "../../components/table-pagination";
import timeTransformer from "../../../utils/time-transformer";
import {useGlobalState} from "../../../hooks/use-global-state";
import TableSorterHeader from "../../components/table-sorter-header";
import moment from "moment";
import nl2br from "../../../utils/nl2br";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Popover from "@mui/material/Popover";
import {Box} from "@mui/system";
import Stack from "@mui/material/Stack";

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

    const MapStatusIcon = ({task_status}) => {
        const color = mapStatusColor(task_status)
        switch (task_status) {
            case taskStatuses.RUNNING:
                return <RadioButtonCheckedIcon color={color}/>
            case taskStatuses.FINISHED:
                return <CheckCircleOutlineIcon color={color}/>
            case taskStatuses.TIMEOUT:
            case taskStatuses.FAILED:
            case taskStatuses.CANCELED:
                return <CancelIcon color={color}/>
            default:
                return <InfoIcon color={color}/>
        }
    }


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

    const handlePopoverEnter = (event, item) => {
        setPopoverShow({anchor: event.currentTarget, item})
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
                            {/*<TableCell>*/}
                            {/*    Task Duration*/}
                            {/*</TableCell>*/}
                            <TableCell>
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
                                            {item?.created_by}
                                        </TableCell>
                                        <TableCell>
                                            {timeTransformer(item.finished_at, timeSetting)}
                                        </TableCell>
                                        {/*<TableCell>*/}
                                        {/*    {item.finished_at ? moment.utc(moment(item.finished_at).diff(moment(item.started_at))).format("HH:mm:ss") : '-'}*/}
                                        {/*</TableCell>*/}
                                        <TableCell align="left">
                                            {/*<SeverityPill color={mapStatusColor(item.task_status)}>*/}
                                            {/*    {item.task_status}*/}
                                            {/*</SeverityPill>*/}
                                            <Stack onMouseEnter={(event) => handlePopoverEnter(event, item)}
                                                   onMouseLeave={handlePopoverLeave}>
                                                <SvgIcon>
                                                    <MapStatusIcon task_status={item.task_status}/>
                                                </SvgIcon>
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
                                    {
                                        isCurrent && (
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
                                                            {item.warnings && !!item.warnings.length &&
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
                                        )
                                    }
                                </Fragment>
                            )
                                ;
                        })}
                    </TableBody>
                </Table>
                <Popover
                    id="mouse-over-popover"
                    sx={{pointerEvents: 'none', cursor: 'pointer'}}
                    open={!!popoverShow?.anchor}
                    anchorEl={popoverShow?.anchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverLeave}
                    disableRestoreFocus
                >
                    <Stack direction='row'
                           alignItems='center'
                           gap={2}
                           sx={{m: 2}}>
                        <SeverityPill color={mapStatusColor(popoverShow?.item?.task_status)}>
                            {popoverShow?.item?.task_status}
                        </SeverityPill>
                        <Stack direction='row'
                               alignItems='center'>
                            <Typography variant="h6">
                                Duration:
                            </Typography>
                            <Typography>
                                {popoverShow?.item?.finished_at ? moment.utc(moment(popoverShow?.item?.finished_at).diff(moment(popoverShow?.item?.started_at))).format("HH:mm:ss") : '-'}
                            </Typography>
                        </Stack>
                    </Stack>
                </Popover>
            </Scrollbar>
        </TablePagination>
    )
        ;
};

ListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
