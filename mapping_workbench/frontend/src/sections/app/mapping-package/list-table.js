import {Fragment, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import PropTypes from 'prop-types';

import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Box from "@mui/system/Box";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import Checkbox from "@mui/material/Checkbox";
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from "@mui/material/FormControlLabel";

import {paths} from "src/paths";
import {Scrollbar} from 'src/components/scrollbar';
import {toastError} from "src/components/app-toast";
import timeTransformer from "src/utils/time-transformer";
import {useGlobalState} from "src/hooks/use-global-state";
import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import ConfirmDialog from "src/components/app/dialog/confirm-dialog";
import {ChevronButton} from 'src/sections/components/chevron-button';
import {MenuActionButton, MenuActions} from 'src/components/menu-actions';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import TableSorterHeader from 'src/sections/components/table-sorter-header';
import TablePagination from "src/sections/components/table-pagination";
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {MappingPackageProcessForm} from './components/mapping-package-process-form';
import {MappingPackagesBulkActions} from './components/mapping-packages-bulk-actions';
import {SeverityPill} from "../../../components/severity-pill";

const MappingPackageRowFragment = (props) => {

    const {
        item,
        item_id,
        isCurrent,
        handleItemToggle,
        handleItemSelect,
        handleGoLastState,
        handleDeleteAction,
        isItemSelected,
        timeSetting,
        sectionApi,
        selectable
    } = props;

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [cleanupProject, setCleanupProject] = useState(false);
    const [processStatus, setProcessStatus] = useState("");

    useEffect(() => {
        setProcessStatus(sectionApi.processStatus(item.process_status));
    }, [item]);

    return (
        <>
            <Fragment key={item_id}>
                <TableRow
                    hover
                    key={item_id}
                    id={item_id}
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
                            }),
                            whiteSpace: "nowrap"
                        }}
                    >
                        <Checkbox
                            color="primary"
                            disabled={selectable && !selectable(item)}
                            checked={isItemSelected(item_id)}
                            onClick={event => handleItemSelect(event.target.checked, item_id)}
                        />
                        <ChevronButton onClick={() => handleItemToggle(item_id)}
                                       isCurrent={isCurrent}/>
                    </TableCell>

                    <TableCell width="25%">
                        <Typography variant="subtitle2">
                            {item.title}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        {item.identifier}
                    </TableCell>
                    <TableCell align="left">
                        {timeTransformer(item.created_at, timeSetting)}
                    </TableCell>
                    <TableCell>
                        <SeverityPill color={processStatus.color}>
                            {processStatus.title}
                        </SeverityPill>
                    </TableCell>
                    <TableCell align="center">
                        <MenuActions>
                            <MenuActionButton
                                id='view_last_state_button'
                                onClick={() => handleGoLastState(item_id)}
                                title='View Last State'
                                icon={<DownloadDoneOutlinedIcon/>}
                            />
                            <ListItemActions
                                itemctx={new ForListItemAction(item_id, sectionApi)}
                            />
                            <MenuActionButton
                                id="delete_button"
                                onClick={() => setConfirmOpen(true)}
                                icon={<DeleteOutlineIcon/>}
                                title='Delete'/>
                        </MenuActions>
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
                                <Grid container>
                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <PropertyList>
                                            <PropertyListItem
                                                label="Description"
                                                value={item.description}
                                                sx={{
                                                    whiteSpace: "pre-wrap",
                                                    px: 3,
                                                    py: 1.5
                                                }}
                                            />
                                        </PropertyList>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <Divider/>
                            <MappingPackageProcessForm
                                items={[item]}
                                sectionApi={sectionApi}
                                showExport
                            />
                        </TableCell>
                    </TableRow>
                )}
            </Fragment>
            <ConfirmDialog
                title="Delete It?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={() => handleDeleteAction(item_id, cleanupProject)}
                footer={<Box sx={{
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={cleanupProject}
                                onChange={(e) => {
                                    setCleanupProject(e.target.checked)
                                }}
                            />
                        }
                        label="Cleanup Project Assets"
                        value="cleanup_project"
                    />
                </Box>}
            >
                Are you sure you want to delete it?
            </ConfirmDialog>
        </>
    )
}

export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {},
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sort,
        onSort = () => {},
        selectable = null,
        sectionApi
    } = props;
    const [currentItem, setCurrentItem] = useState(null);
    const {timeSetting} = useGlobalState();
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState([]);

    const isItemSelected = itemId => selectedItems.indexOf(itemId) !== -1;

    const allChecked = items.length > 0 && selectedItems.length === items.length

    const handleItemsSelectAll = checked => {
        setSelectedItems(checked ? items.map(item => item._id) : [])
    }

    const handleItemSelect = (checked, itemId) => {
        setSelectedItems(items => checked ? [...items, itemId] : items.filter(item => item !== itemId));
    }

    const handleItemToggle = itemId => {
        setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);
    }

    const handleGoLastState = (id) => {
        sectionApi.getLatestState(id)
            .then(res => {
                router.push(paths.app[sectionApi.section].states.view(id, res._id))
            })
            .catch(err => toastError(err))
    }

    const handleDeleteAction = (id, cleanup_project = false) => {
        sectionApi.deleteMappingPackageWithCleanup(id, cleanup_project)
            .finally(() => {
                    router.push({pathname: paths.app[sectionApi.section].index});
                    router.reload()
                }
            )
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
                <MappingPackagesBulkActions items={items.filter(item => selectedItems.includes(item._id))}
                                            disabled={!selectedItems.length}/>
                <Divider/>
                <Scrollbar>
                    <Table sx={{minWidth: 1200}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox checked={allChecked}
                                              indeterminate={!!selectedItems.length && !allChecked}
                                              onChange={(event) => handleItemsSelectAll(event.target.checked)}
                                    />
                                </TableCell>
                                <SorterHeader width="25%"
                                              fieldName='title'/>
                                <SorterHeader fieldName='identifier'/>
                                <SorterHeader fieldName='created_at'
                                              title='created'
                                              align="left"/>
                                <SorterHeader fieldName='process_status'
                                              title='status'
                                              align="right"/>
                                <TableCell align="center"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const item_id = item._id;
                                const isCurrent = item_id === currentItem;

                                return (
                                    <MappingPackageRowFragment
                                        key={item_id}
                                        item_id={item_id}
                                        item={item}
                                        isCurrent={isCurrent}
                                        handleItemToggle={handleItemToggle}
                                        handleItemSelect={handleItemSelect}
                                        handleGoLastState={handleGoLastState}
                                        handleDeleteAction={handleDeleteAction}
                                        isItemSelected={isItemSelected}
                                        timeSetting={timeSetting}
                                        sectionApi={sectionApi}
                                        selectable={selectable}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </Paper>
        </TablePagination>
    );
};

ListTable.propTypes = {
    count: PropTypes.number,
    items:
    PropTypes.array,
    onPageChange:
    PropTypes.func,
    onRowsPerPageChange:
    PropTypes.func,
    page:
    PropTypes.number,
    rowsPerPage:
    PropTypes.number,
    sectionApi:
    PropTypes.object
};

MappingPackageRowFragment.propTypes = {
    item_id: PropTypes.string,
    item:
    PropTypes.object,
    isCurrent:
    PropTypes.bool,
    handleItemToggle:
    PropTypes.func,
    handleGoLastState:
    PropTypes.func,
    handleDeleteAction:
    PropTypes.func,
    timeSetting:
    PropTypes.number,
    sectionApi:
    PropTypes.object
}