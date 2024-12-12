import {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import EditIcon from '@untitled-ui/icons-react/build/esm/Edit05';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Box from "@mui/system/Box";
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import SvgIcon from '@mui/material/SvgIcon';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import {sessionApi} from 'src/api/session';
import {useDialog} from 'src/hooks/use-dialog';
import {Scrollbar} from 'src/components/scrollbar';
import {toastSuccess} from 'src/components/app-toast';
import timeTransformer from "src/utils/time-transformer";
import {useGlobalState} from "src/hooks/use-global-state";
import {mappingPackagesApi} from "src/api/mapping-packages";
import TablePagination from "src/sections/components/table-pagination";
import CodeMirrorDefault from 'src/components/app/form/codeMirrorDefault';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {genericTripleMapFragmentsApi} from 'src/api/triple-map-fragments/generic';
import TableSorterHeader from "src/sections/components/table-sorter-header";
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {
    MappingPackageCheckboxList
} from 'src/sections/app/mapping-package/components/mapping-package-real-checkbox-list';


export const ListTableMappingPackages = (props) => {
    const {
        item,
        initProjectMappingPackages = null,
        onPackagesUpdate = () => {
        },
        isCurrent,
        isHovered,
        itemFilteredMappingPackages
    } = props;
    const [mappingPackages, setMappingPackages] = useState(itemFilteredMappingPackages);
    const [projectMappingPackages, setProjectMappingPackages] = useState(initProjectMappingPackages ?? []);
    const [tempMappingPackages, setTempMappingPackages] = useState(itemFilteredMappingPackages);

    const mappingPackagesDialog = useDialog();

    const handleMappingPackagesUpdate = () => {
        const values = {}
        values['id'] = item._id;
        values['project'] = sessionApi.getSessionProject();
        values['refers_to_mapping_package_ids'] = tempMappingPackages;
        genericTripleMapFragmentsApi.updateItem(values)
            .then(res => {
                setMappingPackages(tempMappingPackages);
                item.refers_to_mapping_package_ids = tempMappingPackages;
                toastSuccess(genericTripleMapFragmentsApi.SECTION_ITEM_TITLE + ' updated');
                mappingPackagesDialog.handleClose();
                onPackagesUpdate()
            })
            .catch(err => console.error(err))
    };

    const itemMappingPackages = projectMappingPackages.filter(x => mappingPackages.includes(x.id))
    const mappingPackagesDialogHandleClose = () => {
        mappingPackagesDialog.handleClose();
        setTempMappingPackages(itemFilteredMappingPackages);
    }

    return (<>
        {!!itemMappingPackages.length && <Box>
            {itemMappingPackages.map(x => <Chip key={"mapping_package_" + x.id}
                                                sx={{mb: 1, mr: 1}}
                                                label={x.title}/>)}
        </Box>}
        {isHovered && <Box sx={{position: "absolute", left: "50%", top: "50%"}}>
            <Button
                aria-describedby={"mapping_packages_dialog_" + item._id}
                variant="contained"
                size="small"
                color="primary"
                onClick={mappingPackagesDialog.handleOpen}
                sx={{marginLeft: "-50%", marginTop: "-50%"}}
            >
                <SvgIcon fontSize="small">
                    <EditIcon/>
                </SvgIcon>
            </Button>
        </Box>}
        <Dialog
            id={"mapping_packages_dialog_" + item._id}
            onClose={mappingPackagesDialogHandleClose}
            open={mappingPackagesDialog.open}
            fullWidth
            maxWidth="sm"
        >
            <Stack
                spacing={3}
                sx={{
                    px: 3, py: 2
                }}
            >
                <Typography variant="h6">
                    Mapping Rule Packages
                </Typography>
                <Box
                    spacing={3}>
                    <MappingPackageCheckboxList
                        handleUpdate={setTempMappingPackages}
                        mappingPackages={tempMappingPackages}
                        initProjectMappingPackages={projectMappingPackages}/>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={handleMappingPackagesUpdate}
                >
                    Update
                </Button>
            </Stack>
        </Dialog>
    </>)
}

export const ListTable = (props) => {
    const {
        count = 0, items = [], onPageChange = () => {
        }, onRowsPerPageChange, page = 0, sort, onSort = () => {
        }, rowsPerPage = 0, sectionApi
    } = props;

    const [currentItem, setCurrentItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const {timeSetting} = useGlobalState()

    const handleItemToggle = itemId => setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (<TableSorterHeader sort={{direction, column: sort.column}}
                                   onSort={onSort}
                                   {...props}
        />)
    }

    const onPackagesUpdate = () => {
    }

    const [projectMappingPackages, setProjectMappingPackages] = useState([]);

    useEffect(() => {
        mappingPackagesApi.getProjectPackages()
            .then(res => setProjectMappingPackages(res))
            .catch(err => console.error(err))
    }, [])

    const projectMappingPackagesMap = projectMappingPackages.reduce((a, b) => {
        a[b['id']] = b['title'];
        return a
    }, {})

    return (<div>
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
                                <SorterHeader fieldName="triple_map_uri"
                                              title="URI"/>
                            </TableCell>
                            <TableCell>
                                Packages
                            </TableCell>
                            <TableCell align="left">
                                <SorterHeader fieldName="created_at"
                                              title="Created"/>
                            </TableCell>
                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => {
                            const item_id = item._id;
                            const isCurrent = item_id === currentItem;

                            return (<Fragment key={item_id}>
                                <TableRow
                                    hover
                                    key={item_id}
                                >
                                    <TableCell
                                        padding="checkbox"
                                        sx={{
                                            ...(isCurrent && {
                                                position: 'relative', '&:after': {
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
                                        {item.triple_map_content &&
                                            <IconButton onClick={() => handleItemToggle(item_id)}>
                                                <SvgIcon sx={{
                                                    transform: isCurrent ? 'rotate(90deg)' : '',
                                                    transition: 'linear 0.2s'
                                                }}>
                                                    {<ChevronRightIcon/>}
                                                </SvgIcon>
                                            </IconButton>}
                                    </TableCell>

                                    <TableCell width="25%">
                                        <Typography variant="subtitle2">
                                            {item.triple_map_uri}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{position: "relative"}}
                                               onMouseEnter={() => setHoveredItem(item._id)}
                                               onMouseLeave={() => setHoveredItem(null)}>
                                        {projectMappingPackagesMap && <ListTableMappingPackages
                                            item={item}
                                            itemFilteredMappingPackages={item.refers_to_mapping_package_ids}
                                            initProjectMappingPackages={projectMappingPackages}
                                            onPackagesUpdate={onPackagesUpdate}
                                            isCurrent={isCurrent}
                                            isHovered={hoveredItem === item._id}
                                        />}
                                    </TableCell>
                                    <TableCell align="left">
                                        {timeTransformer(item.created_at, timeSetting)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <ListItemActions
                                            itemctx={new ForListItemAction(item_id, sectionApi)}/>
                                    </TableCell>
                                </TableRow>
                                {isCurrent && (<TableRow>
                                    <TableCell
                                        colSpan={7}
                                        sx={{
                                            p: 0, position: 'relative', '&:after': {
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
                                                    <Box>Content:</Box>
                                                    <CodeMirrorDefault
                                                        style={{resize: 'vertical', overflow: 'auto', height: 600}}
                                                        value={item.triple_map_content}
                                                        lang={item.format}
                                                        disabled/>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </TableCell>
                                </TableRow>)}
                            </Fragment>);
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
        </TablePagination>
    </div>);
};

ListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
