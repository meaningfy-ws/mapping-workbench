import {useCallback, useEffect, useState} from 'react';
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import PropTypes from 'prop-types';
import parse from "html-react-parser";
import {useFormik} from "formik";
import * as Yup from "yup";

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
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import ListItem from "@mui/material/ListItem";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import FormControlLabel from "@mui/material/FormControlLabel";

import {paths} from "src/paths";
import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';

import {useDialog} from "../../../hooks/use-dialog";
import {mappingPackagesApi} from "../../../api/mapping-packages";
import {FormCodeTextArea} from "../../../components/app/form/code-text-area";
import {genericTripleMapFragmentsApi} from "../../../api/triple-map-fragments/generic";
import {MappingPackageCheckboxList} from "../mapping-package/components/mapping-package-checkbox-list";
import {COMMENT_PRIORITY, conceptualMappingRulesApi} from "../../../api/conceptual-mapping-rules";
import {ListSelectorSelect as ResourceListSelector} from "../../../components/app/list-selector/select";
import {sparqlTestFileResourcesApi} from "../../../api/sparql-test-suites/file-resources";


export const ListTableTripleMapFragment = (props) => {
    const {
        item, initProjectTripleMapFragments = null,
        isCurrent,
        isHovered
    } = props;


    const [tripleMapFragment, setTripleMapFragment] = useState({});
    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState(initProjectTripleMapFragments || []);
    const triple_map_fragment_id = item.triple_map_fragment && item.triple_map_fragment.id;

    useEffect(() => {
        (async () => {
            if (initProjectTripleMapFragments === null) {
                setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getValuesForSelector());
            }
            if (triple_map_fragment_id) {
                setTripleMapFragment(projectTripleMapFragments.find(x => x._id === triple_map_fragment_id));
            }
        })()
    }, [genericTripleMapFragmentsApi])

    const [ruleTripleMapFragment, setRuleTripleMapFragment] = useState(triple_map_fragment_id);

    const initialValues = {
        triple_map_uri: (tripleMapFragment && tripleMapFragment.triple_map_uri) || '',
        triple_map_content: (tripleMapFragment && tripleMapFragment.triple_map_content) || '',
        format: (tripleMapFragment && tripleMapFragment.format) || genericTripleMapFragmentsApi.FILE_RESOURCE_DEFAULT_FORMAT || '',
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
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

    const handleTripleMapFragmentDialogOpen = async () => {
        setUpdateContent(false);
        const tripleMapFragmentData = ruleTripleMapFragment ?
            await genericTripleMapFragmentsApi.getItem(ruleTripleMapFragment) : null;
        setTripleMapFragment(tripleMapFragmentData || {});
        tripleMapFragmentDialog.handleOpen();
    }

    const handleTripleMapFragmentDialogClose = async () => {
        tripleMapFragmentDialog.handleClose();
        setUpdateContent(false);
        setTripleMapFragment({});
    }

    const handleTripleMapFragmentUpdate = async () => {
        let values = {}
        const tripleMapFragmentId = tripleMapFragment && tripleMapFragment._id || null;
        values['id'] = item._id;
        values['triple_map_fragment'] = tripleMapFragmentId;
        await conceptualMappingRulesApi.updateItem(values);
        setRuleTripleMapFragment(tripleMapFragmentId);
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
    }

    const handleTripleMapFragmentSelect = async (e) => {
        setUpdateContent(false);
        await setTripleMapFragment(await genericTripleMapFragmentsApi.getItem(e.target.value));
    }

    const ruleTripleMapFragments = projectTripleMapFragments.filter(x => ruleTripleMapFragment === x.id);
    return (<>
        {ruleTripleMapFragments.length > 0 && (
            <Box sx={{mb: 1}}>
                {ruleTripleMapFragments.map(x => (
                    <ListItem sx={{whiteSpace: "w"}}
                              key={"triple_map_fragment_" + x.id}>{x.uri}</ListItem>
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
                color="primary"
                onClick={handleTripleMapFragmentDialogOpen}
                component={Link}
                sx={{
                    marginLeft: "-50%",
                    marginTop: "-50%"
                }}
            >
                <SvgIcon fontSize="small">
                    <EditIcon/>
                </SvgIcon>
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
                    <Box
                         spacing={3}>
                        <FormControl sx={{my: 2, width: '100%'}}>
                            <TextField
                                fullWidth
                                label={genericTripleMapFragmentsApi.SECTION_ITEM_TITLE}
                                onChange={handleTripleMapFragmentSelect}
                                select
                                value={tripleMapFragment?._id ?? ""}
                            >
                                <MenuItem value={null}>&nbsp;</MenuItem>
                                {projectTripleMapFragments.map((x) => (
                                    <MenuItem key={x.id}
                                              value={x.id}>{x.uri}</MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Box>
                    {tripleMapFragment?._id && (
                        <>
                            <Box>
                                <Grid xs={12}
                                      md={12}
                                      pb={2}
                                      item>
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
                                        <Grid xs={12}
                                              md={12}>
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
                                                            <MenuItem value={key}
                                                                      key={key}>
                                                                {genericTripleMapFragmentsApi.FILE_RESOURCE_FORMATS[key]}
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid xs={12}
                                              md={12}
                                              py={2}>
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
        item, initProjectMappingPackages = null, onPackagesUpdate = () => {
        },
        isCurrent,
        isHovered
    } = props;

    let ruleFilteredMappingPackages = item.refers_to_mapping_package_ids || [];
    const [mappingPackages, setMappingPackages] = useState(ruleFilteredMappingPackages);
    const [projectMappingPackages, setProjectMappingPackages] = useState(initProjectMappingPackages || []);
    const [tempMappingPackages, setTempMappingPackages] =
        useState(JSON.parse(JSON.stringify(ruleFilteredMappingPackages)));

    useEffect(() => {
        (async () => {
            if (initProjectMappingPackages === null) {
                setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
            }
        })()
    }, [mappingPackagesApi])

    const mappingPackagesDialog = useDialog();

    const handleMappingPackagesUpdate = useCallback(async () => {
        let values = {}
        values['id'] = item._id;
        values['refers_to_mapping_package_ids'] = tempMappingPackages;
        await conceptualMappingRulesApi.updateItem(values);
        setMappingPackages(tempMappingPackages);
        item.refers_to_mapping_package_ids = tempMappingPackages;
        toast.success(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        mappingPackagesDialog.handleClose();
        onPackagesUpdate()
    }, [item, onPackagesUpdate, tempMappingPackages]);

    const ruleMappingPackages = projectMappingPackages.filter(x => mappingPackages.includes(x.id))

    const mappingPackagesDialogHandleClose = useCallback(() => {
        mappingPackagesDialog.handleClose();
        setTempMappingPackages(JSON.parse(JSON.stringify(ruleFilteredMappingPackages)));
    }, [mappingPackagesDialog])

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
                color="primary"
                onClick={mappingPackagesDialog.handleOpen}
                component={Link}
                sx={{
                    marginLeft: "-50%",
                    marginTop: "-50%"
                }}
            >
                <SvgIcon fontSize="small">
                    <EditIcon/>
                </SvgIcon>
            </Button>}
        </Box>
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

export const ListTableSPARQLAssertions = (props) => {
    const {
        item,
        isCurrent,
        isHovered,
        initProjectSPARQLResources = null
    } = props;

    let ruleFilteredSparqlResources = (item.sparql_assertions || []).map(x => x.id);
    const [sparqlResources, setSparqlResources] = useState(ruleFilteredSparqlResources);
    const [projectSPARQLResources, setProjectSPARQLResources] = useState(initProjectSPARQLResources || []);
    const [tempSparqlResources, setTempSparqlResources] = useState(
        JSON.parse(JSON.stringify(ruleFilteredSparqlResources))
    );

    useEffect(() => {
        (async () => {
            if (initProjectSPARQLResources === null) {
                setProjectSPARQLResources(await sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions());
            }
        })()
    }, [sparqlTestFileResourcesApi])

    const sparqlTestFileResourcesDialog = useDialog();

    const handleSparqlTestFileResourcesUpdate = useCallback(async () => {
        const values = {}
        values['id'] = item._id;
        values['sparql_assertions'] = tempSparqlResources;
        await conceptualMappingRulesApi.updateItem(values);
        setSparqlResources(tempSparqlResources);
        item.sparql_assertions = tempSparqlResources.map(x => {
            return {id: x}
        });
        toast.success(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        sparqlTestFileResourcesDialog.handleClose();
    }, [tempSparqlResources]);

    const sparqlResourcesForSelector = function (filters = {}) {
        return sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions(filters);
    }

    const sparqlTestFileResourcesDialogHandleClose = useCallback(() => {
        sparqlTestFileResourcesDialog.handleClose();
        setTempSparqlResources(JSON.parse(JSON.stringify(ruleFilteredSparqlResources)));
    }, [sparqlTestFileResourcesDialog])

    const ruleSPARQLResources = projectSPARQLResources.filter(x => sparqlResources.includes(x.id))

    return (
        <>
            {ruleSPARQLResources.length > 0 && (
                <Box sx={{mb: 1}}>
                    {ruleSPARQLResources.map(x => (
                        <ListItem key={`sparql_resource_${x.id}`}>{x.title}</ListItem>
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
                    color="primary"
                    onClick={sparqlTestFileResourcesDialog.handleOpen}
                    component={Link}
                    sx={{
                        marginLeft: "-50%",
                        marginTop: "-50%"
                    }}
                >
                    <SvgIcon fontSize="small">
                        <EditIcon/>
                    </SvgIcon>
                </Button>}
            </Box>
            <Dialog
                id={"sparql_assertions_" + item._id}
                onClose={sparqlTestFileResourcesDialogHandleClose}
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
                    <Box
                         spacing={3}>
                        <ResourceListSelector
                            valuesApi={sparqlTestFileResourcesApi}
                            listValues={tempSparqlResources}
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

const RuleComment = (props) => {
    let {comment, ...other} = props;

    let severity;
    switch (comment.priority) {
        case COMMENT_PRIORITY.HIGH:
            severity = 'error';
            break;
        case COMMENT_PRIORITY.LOW:
            severity = 'info';
            break;
        default:
            severity = 'success';
            break;
    }

    return (
        <Alert severity={severity}
               sx={{
                   my: 2
               }}
        >
            <Box>
                {comment.title && <Box><b>{comment.title}</b></Box>}

                <Box>{comment.comment}</Box>
            </Box>
        </Alert>
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
        initProjectTripleMapFragments = null,
        initProjectMappingPackages = null,
        initProjectSPARQLResources = null,
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


    const generateValidityInfo = (termsValidity, pathName, pathValue) => {
        let validityInfo = pathValue;
        if (!termsValidity) {
            return validityInfo;
        }
        for (const termValidity of termsValidity) {
            const color = termValidity.is_valid ? 'green' : 'red'
            validityInfo = validityInfo.replace(
                new RegExp(termValidity.term, 'g'),
                `<b style="color: ${color}">${termValidity.term}</b>`
            )
        }

        return validityInfo;
    }

    const targetPropertyPathValidityInfo = generateValidityInfo(
        item.target_property_path_terms_validity,
        "target_property_path",
        item.target_property_path
    );
    const targetClassPathValidityInfo = generateValidityInfo(
        item.target_class_path_terms_validity,
        "target_class_path",
        item.target_class_path
    );

    const hasTargetPropertyPathValidityErrors =
        item.target_property_path_terms_validity
            ? item.target_property_path_terms_validity.some(x => !x.is_valid)
            : false;
    const hasTargetClassPathValidityErrors =
        item.target_class_path_terms_validity
            ? item.target_class_path_terms_validity.some(x => !x.is_valid)
            : false;

    const mappingNotesDialog = useDialog();
    const editorialNotesDialog = useDialog();
    const feedbackNotesDialog = useDialog();

    return (<>
        <TableRow
            hover
            key={`rule_${item_id}`}
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
                        <Box>
                            {item.source_structural_element &&
                                item.source_structural_element.eforms_sdk_element_id
                            }
                            {item.mapping_group_id && " / "}
                            {item.mapping_group_id}

                        </Box>
                    </Typography>
                </Link>
            </TableCell>
            <TableCell>
                <Box title={item.target_class_path}>
                    {detailedView && item.target_class_path &&
                        <Alert severity={hasTargetClassPathValidityErrors ? "error" : "success"}>
                            {parse(targetClassPathValidityInfo)}
                        </Alert>}
                    {!detailedView && (
                        <>
                            {item.target_class_path && item.target_class_path.length > TRUNCATE_LENGTH && "..."}
                            {item.target_class_path && item.target_class_path.substring(item.target_class_path.length - TRUNCATE_LENGTH)}
                        </>
                    )}
                </Box>
            </TableCell>
            <TableCell>
                <Box title={item.target_property_path}>
                    {detailedView && item.target_property_path &&
                        <Alert severity={hasTargetPropertyPathValidityErrors ? "error" : "success"}>
                            {parse(targetPropertyPathValidityInfo)}
                        </Alert>}
                    {!detailedView && (
                        <>
                            {item.target_property_path && item.target_property_path.length > TRUNCATE_LENGTH && "..."}
                            {item.target_property_path && item.target_property_path.substring(item.target_property_path.length - TRUNCATE_LENGTH)}
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
            <TableCell align="center">
                {item.mapping_notes && item.mapping_notes.length > 0 && <>
                    <Button variant="text"
                            size="small"
                            color="warning"
                            onClick={mappingNotesDialog.handleOpen}
                    >{(item.mapping_notes || []).length}</Button>
                    <Dialog
                        id={"mapping_notes_" + item._id}
                        onClose={mappingNotesDialog.handleClose}
                        open={mappingNotesDialog.open}
                        fullWidth
                        maxWidth="md"
                    >
                        <Card>
                            <CardHeader title="Mapping Notes"
                                        sx={{mb: 2}}/>
                            <Divider/>
                            <CardContent sx={{pt: 1}}>
                                {(item.mapping_notes ?? []).map((mapping_note,i) => <RuleComment
                                        key={'note'+i}
                                        comment={mapping_note}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Dialog>
                </>}
            </TableCell>
            <TableCell align="center">
                {item.editorial_notes && item.editorial_notes.length > 0 && <>
                    <Button variant="text"
                            size="small"
                            color="warning"
                            onClick={editorialNotesDialog.handleOpen}
                    >{(item.editorial_notes || []).length}</Button>
                    <Dialog
                        id={"editorial_notes_" + item._id}
                        onClose={editorialNotesDialog.handleClose}
                        open={editorialNotesDialog.open}
                        fullWidth
                        maxWidth="md"
                    >
                        <Card>
                            <CardHeader title="Editorial Notes"
                                        sx={{mb: 2}}/>
                            <Divider/>
                            <CardContent sx={{pt: 1}}>
                                {(item.editorial_notes || []).map((editorial_note,i) => <RuleComment
                                    key={'note' + i}
                                    comment={editorial_note}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Dialog>
                </>}
            </TableCell>
            <TableCell align="center">
                {item.feedback_notes && item.feedback_notes.length > 0 && <>
                    <Button variant="text"
                            size="small"
                            color="warning"
                            onClick={feedbackNotesDialog.handleOpen}
                    >{(item.feedback_notes || []).length}</Button>
                    <Dialog
                        id={"feedback_notes_" + item._id}
                        onClose={feedbackNotesDialog.handleClose}
                        open={feedbackNotesDialog.open}
                        fullWidth
                        maxWidth="md"
                    >
                        <Card>
                            <CardHeader title="Feedback Notes"
                                        sx={{mb: 2}}/>
                            <Divider/>
                            <CardContent sx={{pt: 1}}>
                                {(item.feedback_notes ?? []).map(
                                    (feedback_note, i) => <RuleComment
                                        key={'note' + i}
                                        comment={feedback_note}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Dialog>
                </>}
            </TableCell>

            <TableCell align="right">
                <ListItemActions
                    itemctx={new ForListItemAction(item_id, sectionApi)}/>
            </TableCell>
        </TableRow>
        {isCurrent && (<TableRow>
            <TableCell
                colSpan={11}
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
                                {item.source_structural_element && (
                                    <>
                                        {item.source_structural_element.eforms_sdk_element_id && <PropertyListItem
                                            key="eforms_sdk_element_id"
                                            label="eForms SDK ID"
                                            value={item.source_structural_element.eforms_sdk_element_id}
                                        />}
                                        {item.source_structural_element.absolute_xpath && <PropertyListItem
                                            key="absolute_xpath"
                                            label="Absolute XPath"
                                            value={item.source_structural_element.absolute_xpath}
                                        />}
                                        {item.source_structural_element.name && <PropertyListItem
                                            key="name"
                                            label="Field Name"
                                            value={item.source_structural_element.name}
                                        />}
                                        {item.source_structural_element.bt_id && <PropertyListItem
                                            key="bt_id"
                                            label="BT ID"
                                            value={item.source_structural_element.bt_id}
                                        />}
                                    </>
                                )}
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
    </>)
}

export const ListTable = (props) => {
    const {
        count = 0, items = [], onPageChange = () => {
        }, onRowsPerPageChange, page = 0, rowsPerPage = 0, sectionApi, onPackagesUpdate = () => {
        }, sortDir, sortField, handleSort, detailedView
    } = props;

    const [currentItem, setCurrentItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleItemToggle = itemId => {
        setCurrentItem((prevItemId) => {
            return prevItemId === itemId ? null : itemId
        });
    }

    const handleItemHover = itemId => {
        setHoveredItem(itemId);
    }

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

    const [isProjectDataReady, setIsProjectDataReady] = useState(false);

    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState([]);
    const [projectMappingPackages, setProjectMappingPackages] = useState([]);
    const [projectSPARQLResources, setProjectSPARQLResources] = useState([]);

    useEffect(() => {
        (async () => {
            setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getValuesForSelector());
            setProjectMappingPackages(await mappingPackagesApi.getProjectPackages());
            setProjectSPARQLResources(await sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions());
            setIsProjectDataReady(true);
        })()
    }, [genericTripleMapFragmentsApi])

    if (!isProjectDataReady) return null;

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
                        <TableCell width="10%">
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
                        <TableCell width="18%">
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
                        <TableCell width="18%">
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
                        <TableCell align="center"
                                   title="Mapping Notes"
                                   sx={{
                                       whiteSpace: "nowrap"
                                   }}
                        >
                            M-Notes
                        </TableCell>
                        <TableCell align="center"
                                   title="Editorial Notes"
                                   sx={{
                                       whiteSpace: "nowrap"
                                   }}
                        >
                            E-Notes
                        </TableCell>
                        <TableCell align="center"
                                   title="Feedback Notes"
                                   sx={{
                                       whiteSpace: "nowrap"
                                   }}
                        >
                            F-Notes
                        </TableCell>
                        <TableCell align="right"
                                   sx={{
                                       whiteSpace: "nowrap"
                                   }}
                        >
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
                            key={`rules_list_row_${item_id}`}
                            item={item}
                            item_id={item_id}
                            isCurrent={isCurrent}
                            handleItemToggle={handleItemToggle}
                            sectionApi={sectionApi}
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
