import {Fragment, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
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
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {Box} from "@mui/system";
import Typography from '@mui/material/Typography';

import {Scrollbar} from 'src/components/scrollbar';
import {useRouter} from "src/hooks/use-router";
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';

import {paths} from "../../../paths";
import {PropertyList} from "../../../components/property-list";
import TablePagination from "../../components/table-pagination";
import timeTransformer from "../../../utils/time-transformer";
import {useGlobalState} from "../../../hooks/use-global-state";
import {ListItemActions} from "../../../components/app/list/list-item-actions";
import {FileUploader} from "./file-uploader";
import {testDataFileResourcesApi as fileResourcesApi} from "src/api/test-data-suites/file-resources";
import {useDialog} from "../../../hooks/use-dialog";
import {PropertyListItem} from "../../../components/property-list-item";
import ConfirmDialog from "../../../components/app/dialog/confirm-dialog";
import {mappingPackagesApi} from "../../../api/mapping-packages";
import Checkbox from "@mui/material/Checkbox";
import {MappingPackagesBulkAssigner} from "/src/sections/app/mapping-package/components/mapping-packages-bulk-assigner";


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
        projectMappingPackagesMap
    } = props;

    const {timeSetting} = useGlobalState()
    const [collectionResources, setCollectionResources] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const uploadDialog = useDialog()


    useEffect(() => {
        getFileResources()
    }, [])

    const getFileResources = () => {
        sectionApi.getFileResources(item_id)
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
                onConfirm={() => handleDeleteResourceAction(confirmOpen)}
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
                        onClick={(event) => handleItemSelect(event, item_id)}
                    />
                    <IconButton onClick={() => handleItemToggle(item_id)}>
                        <SvgIcon>
                            {isCurrent ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                        </SvgIcon>
                    </IconButton>
                </TableCell>
                <TableCell width="25%">
                    <Typography variant="subtitle2">
                        {item.title}
                    </Typography>
                </TableCell>
                <TableCell>
                    {item.mapping_package_id && projectMappingPackagesMap[item.mapping_package_id]}
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
                                                {collectionResources.map((resource) => {
                                                    return (
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
                                                    );
                                                })}
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
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi,
        getItems = () => {}
    } = props;

    const router = useRouter();

    const [currentItem, setCurrentItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [toMappingPackages, setToMappingPackages] = useState([]);

    const isItemSelected = (itemId) => {
        return selectedItems.indexOf(itemId) !== -1;
    }

    const handleItemSelect = (e, itemId) => {
        let items = new Set(selectedItems);
        const isChecked = e.target.checked;
        if (isChecked) {
            items.add(itemId);
        } else {
            items.delete(itemId);
        }
        setSelectedItems([...items]);
    }

    const handleItemToggle = itemId => {
        setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId)
    }

    //TODO: This should be exported to a component that will be used (by extending or composing) by listings that need packages names
    const [projectMappingPackages, setProjectMappingPackages] = useState([]);

    useEffect(() => {
        (async () => {
            setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
        })()
    }, [])

    const [projectMappingPackagesMap, setProjectMappingPackagesMap] = useState({});

    useEffect(() => {
        (() => {
            setProjectMappingPackagesMap(projectMappingPackages.reduce((a, b) => {
                a[b['id']] = b['title'];
                return a
            }, {}));
        })()
    }, [projectMappingPackages])

    const onMappingPackagesAssign = () => {
        getItems()
    }
    return (<>
            <Box sx={{p: 1}}>
                <MappingPackagesBulkAssigner
                    sectionApi={sectionApi}
                    idsToAssignTo={selectedItems}
                    initProjectMappingPackages={projectMappingPackages}
                    toMappingPackages={toMappingPackages}
                    disabled={selectedItems.length === 0}
                    onMappingPackagesAssign={onMappingPackagesAssign}
                />
            </Box>
            <Divider/>
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
                                <TableCell>
                                </TableCell>
                                <TableCell width="25%">
                                    Title
                                </TableCell>
                                <TableCell>
                                    Package
                                </TableCell>
                                <TableCell align="left">
                                    Created
                                </TableCell>
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
                                        projectMappingPackagesMap={projectMappingPackagesMap}
                                    />
                                )
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TablePagination>
        </>
    );
};

TestDataCollectionListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
