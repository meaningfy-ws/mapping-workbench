import {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import PropTypes from 'prop-types';
import {useFormik} from "formik";
import * as Yup from "yup";
import parse from "html-react-parser";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

import EditIcon from '@untitled-ui/icons-react/build/esm/Edit05';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from '@mui/icons-material/Info';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import SvgIcon from '@mui/material/SvgIcon';
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import TableRow from '@mui/material/TableRow';
import MenuItem from "@mui/material/MenuItem";
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import CardHeader from "@mui/material/CardHeader";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

import {paths} from "src/paths";
import {sessionApi} from "src/api/session";
import {useDialog} from "src/hooks/use-dialog";
import {Scrollbar} from 'src/components/scrollbar';
import {toastSuccess} from "src/components/app-toast";
import {MenuActions} from 'src/components/menu-actions';
import {PropertyList} from 'src/components/property-list';
import {mappingPackagesApi} from "src/api/mapping-packages";
import {PropertyListItem} from 'src/components/property-list-item';
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import {ChevronButton} from 'src/sections/components/chevron-button';
import {FormCodeTextArea} from "src/components/app/form/code-text-area";
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import TableSorterHeader from 'src/sections/components/table-sorter-header';
import TablePagination from "src/sections/components/table-pagination-pages";
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {genericTripleMapFragmentsApi} from "src/api/triple-map-fragments/generic";
import {sparqlTestFileResourcesApi} from "src/api/sparql-test-suites/file-resources";
import {COMMENT_PRIORITY, conceptualMappingRulesApi} from "src/api/conceptual-mapping-rules";
import {ListSelectorSelect as ResourceListSelector} from "src/components/app/list-selector/select";
import {
    MappingPackageCheckboxList
} from 'src/sections/app/mapping-package/components/mapping-package-real-checkbox-list';
import {TableLoadWrapper} from '../../components/table-load-wrapper';


export const ListTableTripleMapFragment = (props) => {
    const {
        item, initProjectTripleMapFragments = null,
        isCurrent,
        isHovered
    } = props;

    const [tripleMapFragment, setTripleMapFragment] = useState({});
    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState(initProjectTripleMapFragments || []);
    const triple_map_fragment_id = item.triple_map_fragment?.id;

    useEffect(() => {
        if (initProjectTripleMapFragments === null) {
            genericTripleMapFragmentsApi.getValuesForSelector()
                .then(res => setProjectTripleMapFragments(res))
                .catch(err => console.error(err))
        }
        if (triple_map_fragment_id) {
            setTripleMapFragment(projectTripleMapFragments.find(x => x._id === triple_map_fragment_id));
        }
    }, [])

    const [ruleTripleMapFragment, setRuleTripleMapFragment] = useState(triple_map_fragment_id);

    const initialValues = {
        triple_map_uri: (tripleMapFragment && tripleMapFragment.triple_map_uri) ?? '',
        triple_map_content: (tripleMapFragment && tripleMapFragment.triple_map_content) ?? '',
        format: (tripleMapFragment && tripleMapFragment.format) ?? genericTripleMapFragmentsApi.FILE_RESOURCE_DEFAULT_FORMAT ?? '',
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

    const tripleMapFragmentDetailsDialog = useDialog()

    const [updateContent, setUpdateContent] = useState(false);

    const handleTripleMapFragmentDetailsDialogOpen = () => {
        tripleMapFragmentDetailsDialog.handleOpen();
    }

    const handleTripleMapFragmentDialogOpen = async () => {
        setUpdateContent(false);
        const tripleMapFragmentData = ruleTripleMapFragment ?
            await genericTripleMapFragmentsApi.getItem(ruleTripleMapFragment) : null;
        setTripleMapFragment(tripleMapFragmentData ?? {});
        tripleMapFragmentDialog.handleOpen();
    }

    const handleTripleMapFragmentDialogClose = () => {
        tripleMapFragmentDialog.handleClose();
        setUpdateContent(false);
        setTripleMapFragment({});
    }

    const handleTripleMapFragmentUpdate = async () => {
        const values = {}
        const tripleMapFragmentId = tripleMapFragment?._id ?? null;
        values['id'] = item._id;
        values['project'] = sessionApi.getSessionProject();
        values['triple_map_fragment'] = tripleMapFragmentId;
        await conceptualMappingRulesApi.updateItem(values);
        setRuleTripleMapFragment(tripleMapFragmentId);
        toastSuccess(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');

        if (updateContent) {
            const contentValues = {
                id: tripleMapFragment._id,
                format: formik.values.format,
                triple_map_content: formik.values.triple_map_content
            }
            await genericTripleMapFragmentsApi.updateItem(contentValues);
            toastSuccess(genericTripleMapFragmentsApi.SECTION_ITEM_TITLE + ' updated');
        }
        handleTripleMapFragmentDialogClose();
    }

    const handleTripleMapFragmentSelect = (e) => {
        setUpdateContent(false);
        e.target.value && genericTripleMapFragmentsApi.getItem(e.target.value)
            .then(res => setTripleMapFragment(res))
            .catch(err => console.error(err))
    }

    const ruleTripleMapFragments = projectTripleMapFragments.filter(x => ruleTripleMapFragment === x.id);

    const RuleTripleMapFragments = () => <Box sx={{mb: 1}}>
        {ruleTripleMapFragments.map(x => (
            <ListItem sx={{whiteSpace: "w"}}
                      key={"triple_map_fragment_" + x.id}>{x.uri}</ListItem>
        ))}
    </Box>

    const isRuleTripleMapFragments = !!ruleTripleMapFragments.length

    return (<>
        <Box sx={{mb: 1}}>
            {isRuleTripleMapFragments ? <CheckIcon color="success"/> : <CloseIcon color="error"/>}
        </Box>
        <Box sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
        }}>
            {isHovered && <Tooltip enterDelay={300}
                                   title={isRuleTripleMapFragments && <RuleTripleMapFragments/>}>
                <Stack display="flex"
                       direction="column"
                       gap={1}
                       sx={{
                           marginTop: isRuleTripleMapFragments ? "-50%" : "-31%",
                           transform: "translate(-50%)"
                       }}
                >
                    {isRuleTripleMapFragments && <Button
                        aria-describedby={"triple_map_fragment_dialog_" + item._id}
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={handleTripleMapFragmentDetailsDialogOpen}
                        component={Link}
                    >
                        <SvgIcon fontSize="small">
                            <InfoIcon/>
                        </SvgIcon>
                    </Button>}
                    <Button
                        aria-describedby={"triple_map_fragment_dialog_" + item._id}
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={handleTripleMapFragmentDialogOpen}
                        component={Link}
                    >
                        <SvgIcon fontSize="small">
                            <EditIcon/>
                        </SvgIcon>
                    </Button>
                </Stack>
            </Tooltip>}
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
                                {projectTripleMapFragments.map(({id, uri}) => (
                                    <MenuItem key={id}
                                              value={id}>{uri}</MenuItem>
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
                            {updateContent &&
                                <Box>
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
                                                    variant='standard'
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
                            }
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
        <Dialog
            id={"triple_map_fragment_details_dialog_" + item._id}
            onClose={tripleMapFragmentDetailsDialog.handleClose}
            open={tripleMapFragmentDetailsDialog.open}
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
                    Mapping Rule Triple Map Fragment Details
                </Typography>
                <Divider/>
                <RuleTripleMapFragments/>
            </Stack>
        </Dialog>
    </>)
}

export const ListTableMappingPackages = (props) => {
    const {
        item,
        initProjectMappingPackages = null,
        onPackagesUpdate = () => { },
        isHovered
    } = props;

    const ruleFilteredMappingPackages = item.refers_to_mapping_package_ids ?? [];
    const [mappingPackages, setMappingPackages] = useState(ruleFilteredMappingPackages);
    const [projectMappingPackages, setProjectMappingPackages] = useState(initProjectMappingPackages ?? []);
    const [tempMappingPackages, setTempMappingPackages] =
        useState(ruleFilteredMappingPackages);

    useEffect(() => {
        if (initProjectMappingPackages === null) {
            mappingPackagesApi.getProjectPackages()
                .then(res => setProjectMappingPackages(res))
                .catch(err => console.error(err))
        }
    }, [])

    const mappingPackagesDialog = useDialog();

    const handleMappingPackagesUpdate = async () => {
        const values = {}
        values['id'] = item._id;
        values['project'] = sessionApi.getSessionProject();
        values['refers_to_mapping_package_ids'] = tempMappingPackages;
        await conceptualMappingRulesApi.updateItem(values);
        setMappingPackages(tempMappingPackages);
        item.refers_to_mapping_package_ids = tempMappingPackages;
        toastSuccess(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        mappingPackagesDialog.handleClose();
        onPackagesUpdate()
    };

    const ruleMappingPackages = projectMappingPackages.filter(x => mappingPackages.includes(x.id))

    const mappingPackagesDialogHandleClose = () => {
        mappingPackagesDialog.handleClose();
        setTempMappingPackages(ruleFilteredMappingPackages);
    }

    return (<>
        {ruleMappingPackages.length > 0 && <Box>
            {ruleMappingPackages.map(x => (
                <Chip key={"mapping_package_" + x.id}
                      sx={{mb: 1}}
                      label={x.title}/>))}
        </Box>}
        <Box sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
        }}>
            {isHovered &&
                <Button
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
                </Button>
            }
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

export const ListTableSPARQLAssertions = (props) => {
    const {
        item,
        isCurrent,
        isHovered,
        initProjectSPARQLResources = null
    } = props;

    const ruleFilteredSparqlResources = (item.sparql_assertions ?? []).map(x => x.id);
    const [sparqlResources, setSparqlResources] = useState(ruleFilteredSparqlResources);
    const [projectSPARQLResources, setProjectSPARQLResources] = useState(initProjectSPARQLResources ?? []);
    const [tempSparqlResources, setTempSparqlResources] = useState(ruleFilteredSparqlResources)

    useEffect(() => {
        if (initProjectSPARQLResources === null) {
            sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions()
                .then(res => setProjectSPARQLResources(res))
                .catch(err => console.error(err))
        }
    }, [])

    const sparqlTestFileResourcesDialog = useDialog();

    const handleSparqlTestFileResourcesUpdate = async () => {
        const values = {}
        values['id'] = item._id;
        values['project'] = sessionApi.getSessionProject();
        values['sparql_assertions'] = tempSparqlResources;
        await conceptualMappingRulesApi.updateItem(values);
        setSparqlResources(tempSparqlResources);
        item.sparql_assertions = tempSparqlResources.map(x => ({id: x}));
        toastSuccess(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        sparqlTestFileResourcesDialog.handleClose();
    }

    const sparqlResourcesForSelector = function (filters = {}) {
        return sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions(filters);
    }

    const sparqlTestFileResourcesDialogHandleClose = () => {
        sparqlTestFileResourcesDialog.handleClose();
        setTempSparqlResources(ruleFilteredSparqlResources);
    }

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
    const {comment, ...other} = props;

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
    const syntaxHighlighterTheme = useHighlighterTheme()

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
        handleNotesDialogOpen,
        detailedView
    } = props;

    const TRUNCATE_LENGTH = 35;

    const handleViewAction = async (item_id) => {
        router.push({
            pathname: paths.app[sectionApi.section].view,
            query: {id: item_id}
        });
    }


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
        item.target_property_path_terms_validity?.some(x => !x.is_valid);

    const hasTargetClassPathValidityErrors =
        item.target_class_path_terms_validity?.some(x => !x.is_valid);

    const notesCount = (item.mapping_notes?.length ?? 0) + (item.editorial_notes?.length ?? 0) + (item.feedback_notes?.length ?? 0)

    return (
        <>
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
                    <ChevronButton onClick={() => handleItemToggle(item_id)}
                                   isCurrent={isCurrent}/>
                </TableCell>
                <TableCell>{item.sort_order}</TableCell>
                <TableCell sx={{
                    wordBreak: "normal"
                }}>
                    <Link onClick={() => handleViewAction(item_id)}
                          sx={{cursor: "pointer"}}
                          color="primary"
                    >
                        <Typography variant="subtitle2">
                            <Box>
                                {item.source_structural_element?.sdk_element_id}
                                {item.mapping_group_id && ` / ${item.mapping_group_id}`}
                            </Box>
                        </Typography>
                    </Link>
                    {item.source_structural_element?.name}
                </TableCell>
                <TableCell>{item.min_sdk_version}</TableCell>
                <TableCell>{item.max_sdk_version}</TableCell>
                <TableCell>
                    <Box title={item.target_class_path}>
                        {detailedView && item.target_class_path &&
                            <Alert severity={hasTargetClassPathValidityErrors ? "error" : "success"}>
                                {parse(targetClassPathValidityInfo)}
                            </Alert>}
                        {!detailedView && (
                            <>
                                {item.target_class_path?.length > TRUNCATE_LENGTH && "..."}
                                {item.target_class_path?.substring(item.target_class_path.length - TRUNCATE_LENGTH)}
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
                <TableCell align="center">
                    {!!notesCount &&
                        <Button variant="text"
                                size="small"
                                color="warning"
                                onClick={() => handleNotesDialogOpen(item)}>
                            {notesCount}
                        </Button>}
                </TableCell>

                <TableCell align="right">
                    <MenuActions>
                        <ListItemActions
                            itemctx={new ForListItemAction(item_id, sectionApi)}
                            pathnames={{
                                delete_after_path: () => paths.app.conceptual_mapping_rules.overview
                            }}
                        />
                    </MenuActions>
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
                        <Grid container
                              rowSpacing={2}>
                            <Grid item
                                  xl={6}
                                  md={12}>
                                <PropertyList>
                                    {item.source_structural_element && (
                                        <>
                                            <Typography variant='h5'>
                                                Source
                                            </Typography>
                                            {item.source_structural_element.sdk_element_id && <PropertyListItem
                                                key="sdk_element_id"
                                                label="Field/Node ID"
                                                value={item.source_structural_element.sdk_element_id}
                                            />}
                                            {item.source_structural_element.name && <PropertyListItem
                                                key="name"
                                                label="Field Name"
                                                value={item.source_structural_element.name}
                                            />}
                                            {item.source_structural_element.absolute_xpath && <PropertyListItem
                                                key="absolute_xpath"
                                                label="Absolute XPath"
                                            >
                                                <SyntaxHighlighter
                                                    language="xquery"
                                                    wrapLines
                                                    style={syntaxHighlighterTheme}
                                                    lineProps={{
                                                        style: {
                                                            wordBreak: 'break-all',
                                                            whiteSpace: 'pre-wrap'
                                                        }
                                                    }}>
                                                    {item.source_structural_element.absolute_xpath}
                                                </SyntaxHighlighter>
                                            </PropertyListItem>}
                                        </>
                                    )}
                                </PropertyList>
                            </Grid>
                            <Grid item
                                  xl={6}
                                  md={12}>
                                {!!(item.target_class_path_terms_validity?.length || item.target_property_path_terms_validity?.length) &&
                                    <PropertyList>
                                        <Typography variant='h5'>
                                            Target
                                        </Typography>
                                        {!!item.target_class_path_terms_validity?.length &&
                                            <PropertyListItem label='Ontology Fragment Class path'>
                                                <SyntaxHighlighter
                                                    language="sparql"
                                                    wrapLines
                                                    style={syntaxHighlighterTheme}
                                                    lineProps={{
                                                        style: {
                                                            wordBreak: 'break-all',
                                                            whiteSpace: 'pre-wrap'
                                                        }
                                                    }}>
                                                    {item.target_class_path}
                                                </SyntaxHighlighter>
                                            </PropertyListItem>}
                                        {!!item.target_property_path_terms_validity?.length &&
                                            <PropertyListItem label='Ontology Fragment Property path'>
                                                <SyntaxHighlighter
                                                    language="sparql"
                                                    wrapLines
                                                    style={syntaxHighlighterTheme}
                                                    lineProps={{
                                                        style: {
                                                            wordBreak: 'break-all',
                                                            whiteSpace: 'pre-wrap'
                                                        }
                                                    }}>
                                                    {item.target_property_path}
                                                </SyntaxHighlighter>
                                            </PropertyListItem>}
                                    </PropertyList>}
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
        }, sort, sortField, onSort
    } = props;

    const [detailedView, setDetailedView] = useState(true)
    const [currentItem, setCurrentItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const notesDialog = useDialog()

    const handleItemToggle = itemId => {
        setCurrentItem((prevItemId) => {
            return prevItemId === itemId ? null : itemId
        });
    }

    const handleItemHover = itemId => {
        setHoveredItem(itemId);
    }

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
    }, [])

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
        <TableLoadWrapper dataState={{load:!isProjectDataReady}}
                          data={items}>
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
                    <Stack direction='row'
                           padding={3}>
                        <FormControlLabel control={<Switch checked={detailedView}
                                                           onChange={e => setDetailedView(e.target.checked)}/>}
                                          label='Detailed View'/>
                    </Stack>
                    <Scrollbar>
                        <Table sx={{minWidth: 1200}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell/>
                                    <SorterHeader fieldName='sort_order'
                                                  title='CM Rule Order'/>
                                    <TableCell width="10%">
                                        Conceptual Field/Group
                                    </TableCell>
                                    <TableCell>
                                        Min XSD
                                    </TableCell>
                                    <TableCell>
                                        Max XSD
                                    </TableCell>
                                    <TableCell width="18%">
                                        Ontology Fragment Class path
                                    </TableCell>
                                    <TableCell width="18%">
                                        Ontology Fragment Property path
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
                                    <TableCell align="center"
                                               title="Notes"
                                               sx={{
                                                   whiteSpace: "nowrap"
                                               }}
                                    >
                                        Notes
                                    </TableCell>
                                    <TableCell align="right"
                                               sx={{
                                                   whiteSpace: "nowrap"
                                               }}
                                    />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map(item => {
                                    const item_id = item._id;
                                    const isCurrent = item_id === currentItem;
                                    const isHovered = item_id === hoveredItem;

                                    return (
                                        <ListTableRow
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
                                            handleNotesDialogOpen={notesDialog.handleOpen}
                                        />)
                                })}
                                <Dialog
                                    id='notes_dialog'
                                    onClose={notesDialog.handleClose}
                                    open={notesDialog.open}
                                    fullWidth
                                    maxWidth="md"
                                >
                                    <Card>
                                        <CardHeader title="Notes"
                                                    sx={{mb: 2}}/>
                                        <Divider/>
                                        <CardContent sx={{pt: 1}}>
                                            <Box style={{overflow: 'auto', maxHeight: '40vh'}}>
                                                {notesDialog.data?.mapping_notes && <>
                                                    <Typography>Mapping Notes:</Typography>
                                                    {notesDialog.data.mapping_notes.map((mapping_note, i) =>
                                                        <RuleComment
                                                            key={'mapping_note' + i}
                                                            comment={mapping_note}
                                                        />
                                                    )}
                                                </>}
                                                <Divider sx={{my: 2}}/>
                                                {notesDialog.data?.editorial_notes && <>
                                                    <Typography>Editorial Notes:</Typography>
                                                    {notesDialog.data.editorial_notes.map((editorial_note, i) =>
                                                        <RuleComment
                                                            key={'editorial_notes' + i}
                                                            comment={editorial_note}
                                                        />
                                                    )}
                                                </>}
                                                <Divider sx={{my: 2}}/>
                                                {notesDialog.data?.feedback_notes && <>
                                                    <Typography>Feedback Notes:</Typography>
                                                    {notesDialog.data.feedback_notes.map((feedback_note, i) =>
                                                        <RuleComment key={'feedback_notes' + i}
                                                                     comment={feedback_note}/>
                                                    )}
                                                </>}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Dialog>
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </Paper>
            </TablePagination>
        </TableLoadWrapper>
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
