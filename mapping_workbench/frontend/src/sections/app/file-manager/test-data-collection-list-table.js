import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {Box} from "@mui/system";
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import Checkbox from "@mui/material/Checkbox";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import {FileUploader} from "./file-uploader";

import {paths} from "src/paths";
import {useRouter} from "src/hooks/use-router";
import {useDialog} from "src/hooks/use-dialog";
import {Scrollbar} from 'src/components/scrollbar';
import {ChevronButton} from 'src/sections/components/chevron-button';
import timeTransformer from "src/utils/time-transformer";
import {PropertyList} from "src/components/property-list";
import {useGlobalState} from "src/hooks/use-global-state";
import {mappingPackagesApi} from "src/api/mapping-packages";
import {PropertyListItem} from "src/components/property-list-item";
import ConfirmDialog from "src/components/app/dialog/confirm-dialog";
import TablePagination from "src/sections/components/table-pagination";
import {ListItemActions} from "src/components/app/list/list-item-actions";
import TableSorterHeader from 'src/sections/components/table-sorter-header';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {testDataFileResourcesApi as fileResourcesApi} from "src/api/test-data-suites/file-resources";
import {MappingPackagesBulkAssigner} from "src/sections/app/mapping-package/components/mapping-packages-bulk-assigner";


export const ListTableRow = (props) => {
    const {
        item,
        item_id,
        isCurrent,
        handleItemToggle,
        handleItemSelect,
        isItemSelected,
        sectionApi,
        router,
        getItems,
        projectMappingPackages
    } = props;

    const {timeSetting} = useGlobalState()
    const [collectionResources, setCollectionResources] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const uploadDialog = useDialog()

    useEffect(() => {
        getFileResources()
    }, [])

    const getFileResources = () => {
        sectionApi.getFileResources(item_id, {rowsPerPage: -1})
            .then(res => setCollectionResources(res.items))
    }

    const handleResourceEdit = resource_id => {
        router.push({
            pathname: paths.app[sectionApi.section].resource_manager.edit,
            query: {id: item_id, fid: resource_id}
        });
    }

    const handleDeleteAction = () => {
        sectionApi.deleteItem(item_id)
            .then(res => getItems())
    }

    const handleDeleteResourceAction = () => {
        fileResourcesApi.deleteFileResource(item_id)
            .then(res => getFileResources())
    }

    return (
        <>
            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
                collectionId={uploadDialog.data?.id}
                sectionApi={fileResourcesApi}
                onGetItems={getFileResources}
                onlyAcceptedFormats
            />
            <ConfirmDialog
                title="Delete It?"
                open={!!confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={() => handleDeleteResourceAction()}
            >
                Are you sure you want to delete it?
            </ConfirmDialog>
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
                        }),
                        whiteSpace: "nowrap"
                    }}
                >
                    <Checkbox
                        color="primary"
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
                    <Box>
                        {
                            sectionApi.MAPPING_PACKAGE_LINK_FIELD
                            && projectMappingPackages
                                .filter(
                                    projectMappingPackage => projectMappingPackage?.[sectionApi.MAPPING_PACKAGE_LINK_FIELD]
                                        ?.some(resource_ref => item_id === resource_ref.id)
                                )
                                .map(mapping_package =>
                                    <Chip key={"mapping_package_" + mapping_package.id}
                                          label={mapping_package['title']}
                                          sx={{mb: 1}}
                                    />
                                )
                        }
                    </Box>
                </TableCell>
                <TableCell align="left">
                    {timeTransformer(item.created_at, timeSetting)}
                </TableCell>
                <TableCell align="right">
                    <Stack justifyContent='end'
                           alignItems='center'
                           direction='row'>
                        <Button type='link'
                                onClick={() => uploadDialog.handleOpen({id: item_id})}>Import test data</Button>
                        <ListItemActions
                            itemctx={new ForListItemAction(item_id, sectionApi)}
                            onDeleteAction={handleDeleteAction}/>
                    </Stack>
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
                                    {item.description && (<PropertyList>
                                        <PropertyListItem
                                            label="Description"
                                            value={item.description}
                                            sx={{
                                                whiteSpace: "pre-wrap",
                                                px: 3,
                                                py: 1.5
                                            }}
                                        />
                                    </PropertyList>)}
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    sx={{px: 3}}
                                >
                                    {collectionResources && collectionResources.length > 0 && (
                                        <Box sx={{mt: 2}}>
                                            <Stack divider={<Divider/>}>
                                                {collectionResources.map(resource =>
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        flexWrap="wrap"
                                                        justifyContent="space-between"
                                                        key={item_id + "_" + resource._id}
                                                        sx={{
                                                            px: 2,
                                                            py: 1.5,
                                                        }}
                                                    >
                                                        <div>
                                                            <Typography
                                                                variant="subtitle1">{resource.title}</Typography>
                                                            <Typography
                                                                color="text.secondary"
                                                                variant="caption"
                                                            >
                                                                {}
                                                            </Typography>
                                                        </div>
                                                        <Stack
                                                            alignItems="center"
                                                            direction="row"
                                                            spacing={2}
                                                        >
                                                            <Button
                                                                size="small"
                                                                onClick={() => handleResourceEdit?.(resource._id)}
                                                                color="success">
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                onClick={() => setConfirmOpen(resource._id)}
                                                                color="error">
                                                                Delete
                                                            </Button>
                                                        </Stack>
                                                    </Stack>
                                                )}
                                            </Stack>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider/>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}
export const TestDataCollectionListTable = (props) => {
    const {
        count = 0,
        items = [],
        itemsForced = 0,
        onPageChange = () => { },
        sort,
        onSort = () => {},
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi,
        getItems = (number) => { }
    } = props;

    const router = useRouter();

    const [currentItem, setCurrentItem] = useState(null);
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
        setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId)
    }

    //TODO: This should be exported to a component that will be used (by extending or composing) by listings that need packages names
    const [projectMappingPackages, setProjectMappingPackages] = useState([]);

    useEffect(() => {
        mappingPackagesApi.getProjectPackages(true)
            .then(res => setProjectMappingPackages(res))
            .catch(err => console.error(err))
    }, [itemsForced])

    const onMappingPackagesAssign = () => {
        getItems(Date.now())
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
                <Box sx={{p: 1}}>
                    <MappingPackagesBulkAssigner
                        sectionApi={sectionApi}
                        idsToAssignTo={selectedItems}
                        initProjectMappingPackages={projectMappingPackages}
                        disabled={selectedItems.length === 0}
                        onMappingPackagesAssign={onMappingPackagesAssign}
                    />
                </Box>
                <Divider/>

                <Scrollbar>
                    <Table sx={{minWidth: 1200}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{py: 1, backgroundColor: 'red'}}>
                                    <Checkbox checked={allChecked}
                                              indeterminate={!!selectedItems.length && !allChecked}
                                              onChange={(event) => handleItemsSelectAll(event.target.checked)}
                                    />
                                </TableCell>
                                <SorterHeader width="25%"
                                              fieldName='title'/>
                                <TableCell>
                                    Packages
                                </TableCell>
                                <SorterHeader fieldName='created_at'
                                              title='created'/>
                                <TableCell align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const item_id = item._id;
                                const isCurrent = item_id === currentItem;
                                return (
                                    <ListTableRow
                                        key={item_id}
                                        item={item}
                                        item_id={item_id}
                                        isCurrent={isCurrent}
                                        handleItemToggle={handleItemToggle}
                                        handleItemSelect={handleItemSelect}
                                        isItemSelected={isItemSelected}
                                        sectionApi={sectionApi}
                                        router={router}
                                        getItems={getItems}
                                        projectMappingPackages={projectMappingPackages}
                                    />
                                )
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </Paper>
        </TablePagination>
    );
};

TestDataCollectionListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    itemsForced: PropTypes.number,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    sectionApi: PropTypes.object,
    getItems: PropTypes.func
};


ListTableRow.propTypes = {
    item: PropTypes.object,
    item_id: PropTypes.string,
    isCurrent: PropTypes.bool,
    handleItemToggle: PropTypes.func,
    handleItemSelect: PropTypes.func,
    isItemSelected: PropTypes.func,
    sectionApi: PropTypes.object,
    router: PropTypes.object,
    getItems: PropTypes.func,
    projectMappingPackages: PropTypes.array
}