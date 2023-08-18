import {Fragment, useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import CardContent from '@mui/material/CardContent';
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
import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';

import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import Tooltip from "@mui/material/Tooltip";
import {Box} from "@mui/system";
import {Button} from "@mui/material";
import {MappingPackageCheckboxList} from "../mapping-package/components/mapping-package-checkbox-list";
import Dialog from "@mui/material/Dialog";
import {useDialog} from "../../../hooks/use-dialog";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import {conceptualMappingRulesApi} from "../../../api/conceptual-mapping-rules";
import {mappingPackagesApi} from "../../../api/mapping-packages";
import {genericTripleMapFragmentsApi} from "../../../api/triple-map-fragments/generic";
import {
    GenericTripleMapFragmentListSelector
} from "../generic-triple-map-fragment/components/generic-triple-map-fragment-list-selector";


export const ListTableTripleMapFragments = (props) => {
    const {
        item
    } = props;

    const [tripleMapFragments, setTripleMapFragments] = useState(item.triple_map_fragments.map(x => x._id));
    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState([]);

    useEffect(() => {
        (async () => {
            setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getProjectTripleMapFragments());
        })()
    }, [genericTripleMapFragmentsApi])

    console.log(projectTripleMapFragments, tripleMapFragments);
    const tripleMapFragmentsDialog = useDialog();

    const handleTripleMapFragmentssUpdate = useCallback(async () => {
        let values = {}
        values['id'] = item._id;
        values['triple_map_fragments'] = tripleMapFragments;
        await conceptualMappingRulesApi.updateItem(values);
        toast.success(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        tripleMapFragmentsDialog.handleClose();
    }, []);

    return (
        <>
            {projectTripleMapFragments.filter(x => tripleMapFragments.includes(x.id)).map(x => (
                <Box>{x.uri}</Box>
            ))}
            <Button
                aria-describedby={"triple_map_fragments_" + item._id}
                variant="contained"
                size="small"
                color="success"
                onClick={tripleMapFragmentsDialog.handleOpen}
            >
                Edit
            </Button>
            <Dialog
                id={"triple_map_fragments_" + item._id}
                onClose={tripleMapFragmentsDialog.handleClose}
                open={tripleMapFragmentsDialog.open}
                fullWidth
                maxWidth="sm"
            >
                <Stack
                    spacing={3}
                    sx={{
                        px: 3,
                        py: 2
                    }}
                >
                    <Typography variant="h6">
                        Mapping Rule Triple Map Fragments
                    </Typography>
                    <Box container spacing={3}>
                        <GenericTripleMapFragmentListSelector
                            tripleMapFragments={tripleMapFragments}
                            initProjectTripleMapFragments={projectTripleMapFragments}/>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={handleTripleMapFragmentssUpdate}
                    >
                        Update
                    </Button>
                </Stack>
            </Dialog>
        </>
    )
}

export const ListTableMappingPackages = (props) => {
    const {
        item
    } = props;

    const [mappingPackages, setMappingPackages] = useState(item.mapping_packages.map(x => x._id));
    const [projectMappingPackages, setProjectMappingPackages] = useState([]);

    useEffect(() => {
        (async () => {
            setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
        })()
    }, [mappingPackagesApi])

    const mappingPackagesDialog = useDialog();

    const handleMappingPackagesUpdate = useCallback(async () => {
        let values = {}
        values['id'] = item._id;
        values['mapping_packages'] = mappingPackages;
        await conceptualMappingRulesApi.updateItem(values);
        toast.success(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        mappingPackagesDialog.handleClose();
    }, []);

    return (
        <>
            {projectMappingPackages.filter(x => mappingPackages.includes(x.id)).map(x => (
                <Box>{x.title}</Box>
            ))}
            <Button
                aria-describedby={"mapping_packages_" + item._id}
                variant="contained"
                size="small"
                color="success"
                onClick={mappingPackagesDialog.handleOpen}
            >
                Edit
            </Button>
            <Dialog
                id={"mapping_packages_" + item._id}
                onClose={mappingPackagesDialog.handleClose}
                open={mappingPackagesDialog.open}
                fullWidth
                maxWidth="sm"
            >
                <Stack
                    spacing={3}
                    sx={{
                        px: 3,
                        py: 2
                    }}
                >
                    <Typography variant="h6">
                        Mapping Rule Packages
                    </Typography>
                    <Box container spacing={3}>
                        <MappingPackageCheckboxList
                            mappingPackages={mappingPackages} initProjectMappingPackages={projectMappingPackages}/>
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
        </>
    )
}

export const ListTableRow = (props) => {
    const {
        item,
        item_id,
        isCurrent,
        handleItemToggle,
        sectionApi
    } = props;

    return (
        <Fragment key={item_id}>
            <TableRow
                hover
                key={item_id}
                sx={{verticalAlign: 'top'}}
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
                    <Typography variant="subtitle2">
                        <Box>{item.business_id}</Box>
                        <Box>{item.business_title}</Box>
                    </Typography>
                </TableCell>
                <TableCell>
                    {item.source_xpath.map(x => (
                        <Box>{x}</Box>
                    ))}
                </TableCell>
                <TableCell>
                    {item.target_class_path}
                </TableCell>
                <TableCell>
                    {item.target_property_path}
                </TableCell>
                <TableCell>
                    <ListTableTripleMapFragments item={item}
                                              ruleTripleMapFragments={item.triple_map_fragments}/>
                </TableCell>
                <TableCell>
                    <ListTableMappingPackages item={item}
                                              ruleMappingPackages={item.mapping_packages}/>
                </TableCell>
                <TableCell align="left">
                    {(item.created_at).replace("T", " ").split(".")[0]}
                </TableCell>
                <TableCell align="right">
                    <ListItemActions
                        itemctx={new ForListItemAction(item_id, sectionApi)}/>
                </TableCell>
            </TableRow>
            {
                isCurrent && (
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
                                                value={item.business_description}
                                            />
                                        </PropertyList>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </TableCell>
                    </TableRow>
                )
            }
        </Fragment>
    )
}

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

    //console.log("PROJECT PROPS: ", props);

    const [currentItem, setCurrentItem] = useState(null);

    const handleItemToggle = useCallback((itemId) => {
        setCurrentItem((prevItemId) => {
            if (prevItemId === itemId) {
                return null;
            }

            return itemId;
        });
    }, []);

    // const handleItemClose = useCallback(() => {
    //     setCurrentItem(null);
    // }, []);

    // const handleItemUpdate = useCallback(() => {
    //     setCurrentItem(null);
    //     toast.success('Item updated');
    // }, []);

    // const handleItemDelete = useCallback(() => {

    //     toast.error('Item cannot be deleted');
    // }, []);

    return (
        <div>
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            {/* <TableCell width="25%">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Name
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell> */}
                            <TableCell width="25%">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Conceptual Field/Group
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Source XPath
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Ontology Fragment Class path
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Ontology Fragment Property path
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        RML Triple Map
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        SPARQL assertions
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
                                <ListTableRow item_id={item_id} item={item} isCurrent={isCurrent}
                                              handleItemToggle={handleItemToggle} sectionApi={sectionApi}/>
                            )
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
                rowsPerPageOptions={[5, 10, 25]}
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
