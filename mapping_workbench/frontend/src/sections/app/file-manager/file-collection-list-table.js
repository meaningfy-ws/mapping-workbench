import {useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import PropTypes from 'prop-types';

import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import Box from "@mui/system/Box";
import Grid from '@mui/material/Grid';
import List from "@mui/material/List";
import Table from '@mui/material/Table';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import {Scrollbar} from 'src/components/scrollbar';
import {useRouter} from "src/hooks/use-router";
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {ListFileCollectionActions} from "src/components/app/list/list-file-collection-actions";
import {PropertyListItem} from 'src/components/property-list-item';

import {paths} from "src/paths";
import {useDialog} from "src/hooks/use-dialog";
import timeTransformer from "src/utils/time-transformer";
import {useGlobalState} from "src/hooks/use-global-state";
import {PropertyList} from "src/components/property-list";
import {mappingPackagesApi} from "src/api/mapping-packages";
import TablePagination from "src/sections/components/table-pagination";
import {FileUploader} from "src/sections/app/file-manager/file-uploader";
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
        openUploadModal,
        projectMappingPackages,
        selectable
    } = props;

    const {timeSetting} = useGlobalState()
    const [collectionResources, setCollectionResources] = useState([]);

    useEffect(() => {
        sectionApi.getFileResources(item_id, {rowsPerPage: -1})
            .then(res => setCollectionResources(res.items))
    }, [])

    const handleResourceEdit = resource_id => {
        router.push({
            pathname: paths.app[sectionApi.section].resource_manager.edit,
            query: {id: item_id, fid: resource_id}
        });
        return true;
    }

    return (
        <>
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
                        disabled={selectable && !selectable(item)}
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
                    <List sx={{p: 0, m: 0}}>
                        {

                            sectionApi.MAPPING_PACKAGE_LINK_FIELD
                            && projectMappingPackages
                                .filter(
                                    projectMappingPackage => projectMappingPackage?.[sectionApi.MAPPING_PACKAGE_LINK_FIELD]
                                        .some(resource_ref => item_id === resource_ref.id)
                                )
                                .map((mapping_package) => {
                                    return (
                                        <ListItem
                                            key={"mapping_package_" + mapping_package.id}
                                            sx={{p: 0, m: 0}}
                                        >
                                            {mapping_package['title']}
                                        </ListItem>
                                    );
                                })}
                    </List>
                </TableCell>
                <TableCell align="left">
                    {timeTransformer(item.created_at, timeSetting)}
                </TableCell>
                <TableCell align="right">
                    <Stack direction='row'
                           justifyContent='end'>
                        <Button size="small"
                                onClick={() => openUploadModal?.(item._id)}
                        >
                            Upload
                        </Button>
                        <ListFileCollectionActions
                            itemctx={new ForListItemAction(item_id, sectionApi)}/>
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
                                                                    color="success"
                                                                >Edit</Button>
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
export const FileCollectionListTable = (props) => {
    const {
        count = 0,
        items = [],
        itemsForced = 0,
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi,
        getItems = () => {
        },
        selectable = null,
        fileResourceApi,
    } = props;

    const router = useRouter();
    const [currentItem, setCurrentItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const uploadDialog = useDialog();

    const isItemSelected = (itemId) => selectedItems.indexOf(itemId) !== -1;

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
        mappingPackagesApi.getProjectPackages(true)
            .then(res => setProjectMappingPackages(res))
            .catch(err => console.error(err))
    }, [itemsForced])

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
        getItems(Date.now());
    }

    const openUploadModal = (id) => {
        uploadDialog.handleOpen({id})
    }

    return (<>
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
                                <TableCell align="left">
                                    Packages
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
                                        openUploadModal={openUploadModal}
                                        handleItemToggle={handleItemToggle}
                                        handleItemSelect={handleItemSelect}
                                        isItemSelected={isItemSelected}
                                        sectionApi={sectionApi}
                                        router={router}
                                        projectMappingPackagesMap={projectMappingPackagesMap}
                                        projectMappingPackages={projectMappingPackages}
                                        selectable={selectable}
                                    />
                                )
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TablePagination>
            <FileUploader
                onClose={uploadDialog.handleClose}
                open={uploadDialog.open}
                collectionId={uploadDialog.data?.id}
                sectionApi={fileResourceApi}
                onGetItems={getItems}
            />
        </>
    );
};

FileCollectionListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    itemsForced: PropTypes.number,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    sectionApi: PropTypes.object,
    getItems: PropTypes.func,
    selectable: PropTypes.bool,
    fileResourceApi: PropTypes.func

}

ListTableRow.propTypes = {
    item: PropTypes.object,
    handleItemSelect: PropTypes.func,
    isItemSelected: PropTypes.bool,
    router: PropTypes.func,
    sectionApi: PropTypes.object,
    openUploadModal: PropTypes.func,
    projectMappingPackages: PropTypes.array,
    selectable: PropTypes.bool
};
