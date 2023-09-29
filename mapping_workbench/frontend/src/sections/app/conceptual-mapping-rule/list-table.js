import * as React from 'react';
import {Fragment, useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@untitled-ui/icons-react/build/esm/Edit05';
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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {MappingPackageCheckboxList} from "../mapping-package/components/mapping-package-checkbox-list";
import Dialog from "@mui/material/Dialog";
import {useDialog} from "../../../hooks/use-dialog";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import {conceptualMappingRulesApi} from "../../../api/conceptual-mapping-rules";
import {mappingPackagesApi} from "../../../api/mapping-packages";
import {genericTripleMapFragmentsApi} from "../../../api/triple-map-fragments/generic";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import {FormCodeTextArea} from "../../../components/app/form/code-text-area";
import {useFormik} from "formik";
import * as Yup from "yup";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {ListSelectorSelect as ResourceListSelector} from "../../../components/app/list-selector/select";
import {sparqlTestFileResourcesApi} from "../../../api/sparql-test-suites/file-resources";
import {paths} from "../../../paths";
import {useRouter} from "../../../hooks/use-router";
import ListItem from "@mui/material/ListItem";

export const ListTableTripleMapFragment = (props) => {
    const {
        item, initProjectTripleMapFragments = [],
        isCurrent,
        isHovered
    } = props;


    const [tripleMapFragment, setTripleMapFragment] = useState({});
    const triple_map_fragment_id = item.triple_map_fragment && item.triple_map_fragment.id;
    useEffect(() => {
        (async () => {
            if (triple_map_fragment_id) {
                setTripleMapFragment(await genericTripleMapFragmentsApi.getItem(triple_map_fragment_id));
            }
        })()
    }, [genericTripleMapFragmentsApi])

    const [ruleTripleMapFragment, setRuleTripleMapFragment] = useState(triple_map_fragment_id);

    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState(initProjectTripleMapFragments);

    useEffect(() => {
        (async () => {
            if (initProjectTripleMapFragments.length === 0) {
                await setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getValuesForSelector());
            }
        })()
    }, [genericTripleMapFragmentsApi])

    let initialValues = {
        triple_map_uri: tripleMapFragment.triple_map_uri || '',
        triple_map_content: tripleMapFragment.triple_map_content || '',
        format: tripleMapFragment.format || genericTripleMapFragmentsApi.FILE_RESOURCE_DEFAULT_FORMAT || '',
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: Yup.object({
            triple_map_uri: Yup
                .string()
                .max(255)
                .required('URI is required'),
            triple_map_content: Yup.string().max(2048),
            format: Yup
                .string()
                .max(255)
                .required('Format is required')
        }),
        onSubmit: async (values, helpers) => {
        }
    });

    const tripleMapFragmentDialog = useDialog();

    const [updateContent, setUpdateContent] = useState(false);

    const handleTripleMapFragmentDialogOpen = useCallback(async () => {
        setUpdateContent(false);
        const tripleMapFragmentData = ruleTripleMapFragment ?
            await genericTripleMapFragmentsApi.getItem(ruleTripleMapFragment) : null;
        setTripleMapFragment(tripleMapFragmentData || {});
        tripleMapFragmentDialog.handleOpen();
    }, [tripleMapFragmentDialog, ruleTripleMapFragment]);

    const handleTripleMapFragmentDialogClose = useCallback(async () => {
        tripleMapFragmentDialog.handleClose();
        setUpdateContent(false);
        setTripleMapFragment({});
    }, [tripleMapFragmentDialog]);

    const handleTripleMapFragmentUpdate = useCallback(async () => {
        let values = {}
        values['id'] = item._id;
        values['triple_map_fragment'] = tripleMapFragment._id;
        await conceptualMappingRulesApi.updateItem(values);
        setRuleTripleMapFragment(tripleMapFragment._id);
        toast.success(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');

        if (updateContent) {
            let contentValues = {
                id: tripleMapFragment._id,
                format: formik.values.format,
                triple_map_content: formik.values.triple_map_content
            }
            await genericTripleMapFragmentsApi.updateItem(contentValues);
            toast.success(genericTripleMapFragmentsApi.SECTION_ITEM_TITLE + ' updated');
        }
        handleTripleMapFragmentDialogClose();
    }, [tripleMapFragment, updateContent, handleTripleMapFragmentDialogClose, formik]);

    const handleTripleMapFragmentSelect = useCallback(async (e) => {
        setUpdateContent(false);
        await setTripleMapFragment(await genericTripleMapFragmentsApi.getItem(e.target.value));
    }, [formik, tripleMapFragment]);

    const ruleTripleMapFragments = projectTripleMapFragments.filter(x => ruleTripleMapFragment === x.id);
    return (<>
        {ruleTripleMapFragments.length > 0 && (
            <Box sx={{mb: 1}}>
                {ruleTripleMapFragments.map(x => (
                    <ListItem sx={{whiteSpace: "w"}} key={"triple_map_fragment_" + x.id}>{x.uri}</ListItem>
                ))}
            </Box>
        )}
        <Box sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
        }}>
            {isHovered && <Button
                aria-describedby={"triple_map_fragment_dialog_" + item._id}
                variant="contained"
                size="small"
                color="info"
                onClick={handleTripleMapFragmentDialogOpen}
                component={Link}
                sx={{
                    marginLeft: "-50%",
                    marginTop: "-50%"
                }}
            >
                <EditIcon/>
            </Button>}
        </Box>
        <Dialog
            id={"triple_map_fragment_dialog_" + item._id}
            onClose={handleTripleMapFragmentDialogClose}
            open={tripleMapFragmentDialog.open}
            fullWidth
            maxWidth="sm"
        >
            <Stack
                spacing={3}
                sx={{
                    px: 3, py: 2
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Typography variant="h6">
                        Mapping Rule Triple Map Fragment
                    </Typography>
                    <Box container spacing={3}>
                        <FormControl sx={{my: 2, width: '100%'}}>
                            <TextField
                                fullWidth
                                label={genericTripleMapFragmentsApi.SECTION_ITEM_TITLE}
                                onChange={handleTripleMapFragmentSelect}
                                select
                                value={tripleMapFragment._id}
                            >
                                <MenuItem key="" value={null}>&nbsp;</MenuItem>
                                {projectTripleMapFragments.map((x) => (
                                    <MenuItem key={x.id} value={x.id}>{x.uri}</MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Box>
                    {tripleMapFragment._id && (
                        <>
                            <Box>
                                <Grid xs={12} md={12} pb={2}>
                                    <FormControlLabel
                                        sx={{
                                            width: '100%'
                                        }}
                                        control={
                                            <Switch
                                                checked={updateContent}
                                                onChange={e =>
                                                    setUpdateContent(e.target.checked)}
                                            />
                                        }
                                        label="Update content"
                                        value="updateContent"
                                    />
                                </Grid>
                            </Box>
                            {updateContent && (<Box>
                                    <Grid container>
                                        <Grid xs={12} md={12}>
                                            <FormControl fullWidth>
                                                <FormLabel
                                                    sx={{
                                                        color: 'text.primary',
                                                        mb: 1
                                                    }}
                                                >
                                                    Format
                                                </FormLabel>
                                                <Select
                                                    name="format"
                                                    error={!!(formik.touched.format && formik.errors.format)}
                                                    fullWidth
                                                    helperText={formik.touched.format && formik.errors.format}
                                                    value={formik.values.format}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                >
                                                    {Object.keys(genericTripleMapFragmentsApi.FILE_RESOURCE_FORMATS).map((key) => {
                                                        return (
                                                            <MenuItem value={key} key={key}>
                                                                {genericTripleMapFragmentsApi.FILE_RESOURCE_FORMATS[key]}
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid xs={12} md={12} py={2}>
                                            <FormCodeTextArea
                                                formik={formik}
                                                name="triple_map_content"
                                                label="Content"
                                                grammar={genericTripleMapFragmentsApi.FILE_RESOURCE_CODE[formik.values.format]['grammar']}
                                                language={genericTripleMapFragmentsApi.FILE_RESOURCE_CODE[formik.values.format]['language']}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}
                    <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        color="success"
                        disabled={formik.isSubmitting}
                        onClick={handleTripleMapFragmentUpdate}
                    >
                        Update
                    </Button>
                </form>
            </Stack>
        </Dialog>
    </>)
}

export const ListTableMappingPackages = (props) => {
    const {
        item, initProjectMappingPackages = [], onPackagesUpdate = () => {
        },
        isCurrent,
        isHovered
    } = props;

    const [mappingPackages, setMappingPackages] = useState(item.mapping_packages.map(x => x.id));
    const [projectMappingPackages, setProjectMappingPackages] = useState(initProjectMappingPackages);

    useEffect(() => {
        (async () => {
            if (initProjectMappingPackages.length === 0) {
                setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
            }
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
        onPackagesUpdate()
    }, [item, onPackagesUpdate]);

    const ruleMappingPackages = projectMappingPackages.filter(x => mappingPackages.includes(x.id))
    return (<>
        {ruleMappingPackages.length > 0 && (
            <Box sx={{mb: 1}}>
                {ruleMappingPackages.map(x => (
                    <ListItem key={"mapping_package_" + x.id}>{x.identifier}</ListItem>
                ))}
            </Box>
        )}
        <Box sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
        }}>
            {isHovered && <Button
                aria-describedby={"mapping_packages_dialog_" + item._id}
                variant="contained"
                size="small"
                color="info"
                onClick={mappingPackagesDialog.handleOpen}
                component={Link}
                sx={{
                    marginLeft: "-50%",
                    marginTop: "-50%"
                }}
            >
                <EditIcon/>
            </Button>}
        </Box>
        <Dialog
            id={"mapping_packages_dialog_" + item._id}
            onClose={mappingPackagesDialog.handleClose}
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
    </>)
}

export const ListTableSPARQLAssertions = (props) => {
    const {
        item,
        isCurrent,
        isHovered,
        initProjectSPARQLResources = []
    } = props;

    const [sparqlResources, setSparqlResources] = useState((item.sparql_assertions || []).map(x => x.id));
    const [projectSPARQLResources, setProjectSPARQLResources] = useState(initProjectSPARQLResources);

    useEffect(() => {
        (async () => {
            if (initProjectSPARQLResources.length === 0) {
                setProjectSPARQLResources(await sparqlTestFileResourcesApi.getMappingRuleResources());
            }
        })()
    }, [sparqlTestFileResourcesApi])

    const sparqlTestFileResourcesDialog = useDialog();

    const handleSparqlTestFileResourcesUpdate = useCallback(async () => {
        let values = {}
        values['id'] = item._id;
        values['sparql_assertions'] = sparqlResources;
        await conceptualMappingRulesApi.updateItem(values);
        toast.success(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        sparqlTestFileResourcesDialog.handleClose();
    }, []);

    const sparqlResourcesForSelector = function (filters = {}) {
        return sparqlTestFileResourcesApi.getMappingRuleResources(filters);
    }

    const ruleSPARQLResources = projectSPARQLResources.filter(x => sparqlResources.includes(x.id))

    return (
        <>
            {ruleSPARQLResources.length > 0 && (
                <Box sx={{mb: 1}}>
                    {ruleSPARQLResources.map(x => (
                        <ListItem>{x.title}</ListItem>
                    ))}
                </Box>
            )}
            <Box sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
            }}>
                {isHovered && <Button
                    aria-describedby={"sparql_assertions_" + item._id}
                    variant="contained"
                    size="small"
                    color="info"
                    onClick={sparqlTestFileResourcesDialog.handleOpen}
                    component={Link}
                    sx={{
                        marginLeft: "-50%",
                        marginTop: "-50%"
                    }}
                >
                    <EditIcon/>
                </Button>}
            </Box>
            <Dialog
                id={"sparql_assertions_" + item._id}
                onClose={sparqlTestFileResourcesDialog.handleClose}
                open={sparqlTestFileResourcesDialog.open}
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
                        SPARQL Assertions
                    </Typography>
                    <Box container spacing={3}>
                        <ResourceListSelector
                            valuesApi={sparqlTestFileResourcesApi}
                            listValues={sparqlResources}
                            initProjectValues={projectSPARQLResources}
                            titleField="title"
                            valuesForSelector={sparqlResourcesForSelector}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={handleSparqlTestFileResourcesUpdate}
                    >
                        Update
                    </Button>
                </Stack>
            </Dialog>
        </>
    )
}

export const ListTableRow = (props) => {
    const router = useRouter();

    const {
        item,
        item_id,
        isCurrent,
        isHovered,
        handleItemToggle,
        handleItemHover,
        sectionApi,
        initProjectTripleMapFragments = [],
        initProjectMappingPackages = [],
        initProjectSPARQLResources = [],
        onPackagesUpdate = () => {
        },
        detailedView
    } = props;

    const TRUNCATE_LENGTH = 35;

    const handleViewAction = useCallback(async (item_id) => {
        router.push({
            pathname: paths.app[sectionApi.section].view,
            query: {id: item_id}
        });

    }, [router]);

    return (<Fragment key={item_id}>
        <TableRow
            hover
            key={"rule_" + item_id}
            sx={{
                verticalAlign: 'top',
                wordBreak: "break-all"
            }}
            onMouseEnter={() => handleItemHover(item_id)}
            onMouseLeave={() => handleItemHover(null)}
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
            >
                <IconButton onClick={() => handleItemToggle(item_id)}>
                    <SvgIcon>
                        {isCurrent ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                    </SvgIcon>
                </IconButton>
            </TableCell>
            <TableCell sx={{
                wordBreak: "normal"
            }}>
                <Link onClick={() => handleViewAction(item_id)}
                      sx={{cursor: "pointer"}}
                      color="primary"
                >
                    <Typography variant="subtitle2">
                        <Box>{item.field_id}</Box>
                        <Box>{item.field_title}</Box>
                    </Typography>
                </Link>
            </TableCell>
            <TableCell>
                {item.source_xpath.map(
                    x => (
                        <ListItem title={x}>
                            {detailedView && x}
                            {!detailedView && (
                                <>
                                    {x.length > TRUNCATE_LENGTH && "..."}{x.substring(x.length - TRUNCATE_LENGTH)}
                                </>
                            )}
                        </ListItem>
                    )
                )}
            </TableCell>
            <TableCell>
                <Box title={item.target_class_path}>
                    {detailedView && item.target_class_path}
                    {!detailedView && (
                        <>
                            {item.target_class_path.length > TRUNCATE_LENGTH && "..."}
                            {item.target_class_path.substring(item.target_class_path.length - TRUNCATE_LENGTH)}
                        </>
                    )}
                </Box>
            </TableCell>
            <TableCell>
                <Box title={item.target_property_path}>
                    {detailedView && item.target_property_path}
                    {!detailedView && (
                        <>
                            {item.target_property_path.length > TRUNCATE_LENGTH && "..."}
                            {item.target_property_path.substring(item.target_property_path.length - TRUNCATE_LENGTH)}
                        </>
                    )}
                </Box>
            </TableCell>
            <TableCell sx={{position: "relative"}}>
                <ListTableTripleMapFragment
                    item={item}
                    initProjectTripleMapFragments={initProjectTripleMapFragments}
                    isCurrent={isCurrent}
                    isHovered={isHovered}
                />
            </TableCell>
            <TableCell sx={{position: "relative", wordBreak: "normal"}}>
                <ListTableMappingPackages
                    item={item}
                    initProjectMappingPackages={initProjectMappingPackages}
                    onPackagesUpdate={onPackagesUpdate}
                    isCurrent={isCurrent}
                    isHovered={isHovered}
                />
            </TableCell>
            <TableCell sx={{position: "relative"}}>
                <ListTableSPARQLAssertions
                    item={item}
                    initProjectSPARQLResources={initProjectSPARQLResources}
                    isCurrent={isCurrent}
                    isHovered={isHovered}
                />
            </TableCell>
            {/*<TableCell align="left">
                {(item.created_at).replace("T", " ").split(".")[0]}
            </TableCell>*/}
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
                            <PropertyList>
                                {item.field_id && (<PropertyListItem
                                    key="field_id"
                                    label="Field ID"
                                    value={item.field_id}
                                />)}
                                {item.field_title && (<PropertyListItem
                                    key="field_title"
                                    label="Field Title"
                                    value={item.field_title}
                                />)}
                                {item.field_description && (<PropertyListItem
                                    key="description"
                                    label="Description"
                                    value={item.field_description}
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        px: 3,
                                        py: 1.5
                                    }}
                                />)}
                                {item.source_xpath && (<PropertyListItem
                                    key="source_xpath"
                                    label="Source XPath"
                                    value={item.source_xpath.map(
                                        x => (
                                            <ListItem title={x}>
                                                {x}
                                            </ListItem>
                                        )
                                    )}
                                />)}
                                {item.target_class_path && (<PropertyListItem
                                    key="target_class_path"
                                    label="Ontology Fragment Class path"
                                    value={item.target_class_path}
                                />)}
                                {item.target_property_path && (<PropertyListItem
                                    key="target_property_path"
                                    label="Ontology Fragment Property path"
                                    value={item.target_property_path}
                                />)}

                            </PropertyList>
                        </Grid>
                    </Grid>
                </CardContent>
            </TableCell>
        </TableRow>)}
    </Fragment>)
}

export const ListTable = (props) => {
    const {
        count = 0, items = [], onPageChange = () => {
        }, onRowsPerPageChange, page = 0, rowsPerPage = 0, sectionApi, onPackagesUpdate = () => {
        }, sortDir, sortField, handleSort, detailedView
    } = props;

    const [currentItem, setCurrentItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState([]);
    useEffect(() => {
        (async () => {
            setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getValuesForSelector());
        })()
    }, [genericTripleMapFragmentsApi])

    const [projectMappingPackages, setProjectMappingPackages] = useState([]);
    useEffect(() => {
        (async () => {
            setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
        })()
    }, [mappingPackagesApi])

    const [projectSPARQLResources, setProjectSPARQLResources] = useState([]);
    useEffect(() => {
        (async () => {
            setProjectSPARQLResources(await sparqlTestFileResourcesApi.getMappingRuleResources());
        })()
    }, [sparqlTestFileResourcesApi])

    const handleItemToggle = useCallback((itemId) => {
        setCurrentItem((prevItemId) => {
            if (prevItemId === itemId) {
                return null;
            }

            return itemId;
        });
    }, []);

    const handleItemHover = useCallback((itemId) => {
        setHoveredItem((prevItemId) => {
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

    return (<div>
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
                        <TableCell>
                            <Tooltip
                                enterDelay={300}
                                title="Sort"
                            >
                                <TableSortLabel
                                    active
                                    direction={sortDir}
                                    onClick={handleSort}
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
                            RML Triple Map
                        </TableCell>
                        <TableCell>
                            Mapping Package
                        </TableCell>
                        <TableCell>
                            SPARQL assertions
                        </TableCell>
                        {/*<TableCell align="left">
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
                        </TableCell>*/}
                        <TableCell align="right">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => {
                        const item_id = item._id;
                        const isCurrent = item_id === currentItem;
                        const isHovered = item_id === hoveredItem;

                        return (<ListTableRow
                            item_id={item_id} item={item} isCurrent={isCurrent}
                            handleItemToggle={handleItemToggle} sectionApi={sectionApi}
                            initProjectMappingPackages={projectMappingPackages}
                            initProjectTripleMapFragments={projectTripleMapFragments}
                            initProjectSPARQLResources={projectSPARQLResources}
                            onPackagesUpdate={onPackagesUpdate}
                            handleItemHover={handleItemHover}
                            isHovered={isHovered}
                            detailedView={detailedView}
                        />)
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
