import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/system/Box";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";

import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';
import {RouterLink} from 'src/components/router-link';
import {FormTextField} from "../../../components/app/form/text-field";
import {sessionApi} from "../../../api/session";
import {MappingPackageCheckboxList} from "../mapping-package/components/mapping-package-checkbox-list";
import {fieldsRegistryApi} from "../../../api/fields-registry";
import {genericTripleMapFragmentsApi} from "../../../api/triple-map-fragments/generic";
import {sparqlTestFileResourcesApi} from "../../../api/sparql-test-suites/file-resources";
import {ListSelectorSelect as ResourceListSelector} from "../../../components/app/list-selector/select";
import {COMMENT_PRIORITY} from "../../../api/conceptual-mapping-rules";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";

import {TermValidityInfo} from "./term-validity";

const RuleComment = (props) => {
    const {formik, fieldName, idx, handleDelete, ...other} = props;

    const comment = formik.values[fieldName][idx];
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

    const titleName = `${fieldName}[${idx}][title]`;
    const commentName = `${fieldName}[${idx}][comment]`;

    return (
        <Alert severity={severity}
               sx={{
                   my: 2,
                   position: "relative",
                   paddingRight: "20%"
               }}
        >
            <Box>
                {comment.title && <Box><b>{comment.title}</b></Box>}

                <Box>{comment.comment}</Box>
                <input name={titleName}
                       value={comment.title}
                       type="hidden"/>
                <input name={commentName}
                       value={comment.comment}
                       type="hidden"/>
            </Box>
            <Button
                variant="text"
                size="small"
                color="error"
                onClick={(e) => handleDelete(idx, fieldName)}
                sx={{
                    position: "absolute",
                    top: "5px",
                    right: "5px"
                }}
            >
                Delete
            </Button>
        </Alert>
    )
}

export const EditForm = (props) => {
        const {itemctx, ...other} = props;
        const router = useRouter();

        const sectionApi = itemctx.api;
        const item = itemctx.data;

        const [showMappingNotes, setShowMappingNotes] = useState(false);
        const [showEditorialNotes, setShowEditorialNotes] = useState(false);
        const [showFeedbackNotes, setShowFeedbackNotes] = useState(false);
        const [targetPropertyPathValidityInfo, setTargetPropertyPathValidityInfo] = useState("");
        const [targetPropertyPathTermsValidityInfo, setTargetPropertyPathTermsValidityInfo] = useState([]);
        const [targetClassPathValidityInfo, setTargetClassPathValidityInfo] = useState("");
        const [targetClassPathTermsValidityInfo, setTargetClassPathTermsValidityInfo] = useState([]);

        const checkTermsValidity = (elName, value, hasNotification = true) => {
            const checkTermsValidityOnSuccess = (termsValidity) => {
                let validityInfo = value;
                for (let termValidity of termsValidity) {
                    let color = termValidity.is_valid ? 'green' : 'red'
                    validityInfo = validityInfo.replace(
                        new RegExp(`\\b${termValidity.term}\\b`, 'g'),
                        `<b style="color: ${color}">${termValidity.term}</b>`
                    )
                }
                switch (elName) {
                    case 'target_property_path':
                        setTargetPropertyPathValidityInfo(validityInfo)
                        setTargetPropertyPathTermsValidityInfo(termsValidity)
                        break;
                    case 'target_class_path':
                        setTargetClassPathValidityInfo(validityInfo)
                        setTargetClassPathTermsValidityInfo(termsValidity)
                        break;
                }
            }
            const checkTermsValidityPromise = sectionApi.checkTermsValidity(value);
            if (hasNotification) {
                const toastId = toastLoad(`Checking terms validity ... `)
                checkTermsValidityPromise
                    .then(res => {
                        checkTermsValidityOnSuccess(res)
                        toastSuccess(`Terms checked for validity.`, toastId)
                    })
                    .catch(err => toastError(`Checking terms validity failed: ${err.message}.`, toastId))
            } else {
                checkTermsValidityPromise
                    .then(termsValidity => checkTermsValidityOnSuccess(termsValidity))
            }
        }

        const initComment = () => {
            return {
                title: '',
                comment: '',
                priority: COMMENT_PRIORITY.NORMAL
            }
        }

        const initialValues = {
            source_structural_element: item.source_structural_element?.id ?? '',
            min_sdk_version: item.min_sdk_version ?? '',
            max_sdk_version: item.max_sdk_version ?? '',
            // mapping_group_id: item.mapping_group_id ?? '',
            status: item.status ?? '',
            target_class_path: item.target_class_path ?? '',
            target_property_path: item.target_property_path ?? '',
            refers_to_mapping_package_ids: item.refers_to_mapping_package_ids ?? [],
            sparql_assertions: item.sparql_assertions?.map(x => x.id),
            triple_map_fragment: item.triple_map_fragment?.id ?? '',
            mapping_notes: item.mapping_notes ?? [],
            editorial_notes: item.editorial_notes ?? [],
            feedback_notes: item.feedback_notes ?? [],
            mapping_note: initComment(),
            editorial_note: initComment(),
            feedback_note: initComment()
        };

        const formik = useFormik({
            initialValues,
            validationSchema: Yup.object({
                source_structural_element: Yup
                    .string()
                    .required('Structural Element is required')
            }),
            onSubmit: async (values, helpers) => {
                const toastId = toastLoad(itemctx.isNew ? 'Creating...' : 'Updating...')
                try {
                    const requestValues = values;
                    if (values['mapping_note']?.['comment']) {
                        values['mapping_notes'].push(values['mapping_note']);
                    }
                    delete values['mapping_note'];
                    if (values['editorial_note']?.['comment']) {
                        values['editorial_notes'].push(values['editorial_note']);
                    }
                    delete values['editorial_note'];
                    if (values['feedback_note']?.['comment']) {
                        values['feedback_notes'].push(values['feedback_note']);
                    }
                    delete values['feedback_note'];

                    requestValues['source_structural_element'] = values['source_structural_element'] || null;
                    requestValues['triple_map_fragment'] = values['triple_map_fragment'] || null;
                    let response;
                    requestValues['project'] = sessionApi.getSessionProject();
                    if (itemctx.isNew) {
                        response = await sectionApi.createItem(requestValues);
                    } else {
                        requestValues['id'] = item._id;
                        response = await sectionApi.updateItem(requestValues);
                    }
                    helpers.setStatus({success: true});
                    helpers.setSubmitting(false);
                    toastSuccess(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "Created" : "Updated"), toastId);
                    if (response) {
                        if (itemctx.isNew) {
                            router.push({
                                pathname: paths.app[sectionApi.section].overview.index,
                            });
                        } else if (itemctx.isStateable) {
                            itemctx.setState(response);
                            formik.values.mapping_note = initComment();
                            formik.values.editorial_note = initComment();
                            formik.values.feedback_note = initComment();
                        }
                    }
                } catch (err) {
                    console.error(err);
                    toastError(err, toastId);
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    helpers.setSubmitting(false);
                }
            }
        });

        const handleSourceStructuralElementSelect = e => {
            const value = e.target.value;
            formik.setFieldValue('source_structural_element', value);
        }

        const handleTripleMapFragmentSelect = e => {
            const value = e.target.value;
            formik.setFieldValue('triple_map_fragment', value);
        }

        const sparqlResourcesForSelector = function (filters = {}) {
            return sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions(filters);
        }

        useEffect(() => {
            checkTermsValidity('target_property_path', formik.values.target_property_path, false)
            checkTermsValidity('target_class_path', formik.values.target_class_path, false)
        }, [])

        const handleCloneAction = async () => {
            const toastId = toastLoad('Cloning rule ... ')
            sectionApi.cloneItem(item._id)
                .then(res => {
                    itemctx.setState(res);
                    toastSuccess('Rule successfully cloned.', toastId)
                    router.push({
                        pathname: paths.app[sectionApi.section].edit,
                        query: {id: res._id}
                    });
                })
                .catch(err => toastError(err, toastId))
        }

        const handleDeleteComment = (idx, fieldName) => {
            const values = formik.values[fieldName]
            formik.setFieldValue(fieldName, values.slice(0, idx).concat(values.slice(idx + 1)));
        }

        const hasTargetPropertyPathValidityErrors = targetPropertyPathTermsValidityInfo.some(x => !x.is_valid);
        const hasTargetClassPathValidityErrors = targetClassPathTermsValidityInfo.some(x => !x.is_valid);

        const [prefixedTerms, setPrefixedTerms] = useState([]);
        useEffect(() => {
            (async () => {
                setPrefixedTerms(await sectionApi.getPrefixedTerms());
            })()
        }, [sectionApi])

        const filterTerms = (options, {inputValue}) => {
            const lastTerm = inputValue.split(' ').pop();
            let terms = [];
            if (lastTerm && lastTerm.length >= 3) {
                const regex = new RegExp(`${lastTerm}`, 'i');
                terms = options.filter(function (term) {
                    return regex.test(term);
                });
            }
            return terms;
        }

        const onTermsInputChange = (event, term, formik, fieldName) => {
            let inputValue = formik.values[fieldName];
            if (term !== inputValue) {
                const lastTerm = inputValue.split(' ').pop();
                const fieldValue = inputValue.replace(new RegExp(`\\b${lastTerm}$`), `${term}`)
                formik.setFieldValue(fieldName, fieldValue);
            }
        }

        const [isProjectDataReady, setIsProjectDataReady] = useState(false);

        const [projectSourceStructuralElements, setProjectSourceStructuralElements] = useState([]);
        const [projectTripleMapFragments, setProjectTripleMapFragments] = useState([]);
        const [projectSPARQLResources, setProjectSPARQLResources] = useState([]);

        useEffect(() => {
            (async () => {
                setProjectSourceStructuralElements(await fieldsRegistryApi.getStructuralElementsForSelector());
                setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getValuesForSelector());
                setProjectSPARQLResources(await sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions());
                setIsProjectDataReady(true);
            })()
        }, [])

        if (!isProjectDataReady) return null;

        return (
            <form onSubmit={formik.handleSubmit}
                  {...other}>
                <Card>
                    <CardHeader title={(itemctx.isNew ? 'Create' : 'Edit') + ' ' + sectionApi.SECTION_ITEM_TITLE}/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="min_sdk_version"
                                               label="Min SDK Version"/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="max_sdk_version"
                                               label="Max SDK Version"/>
                            </Grid>
                            {/*<Grid xs={12}*/}
                            {/*      md={12}>*/}
                            {/*    <FormTextField formik={formik}*/}
                            {/*                   name="mapping_group_id"*/}
                            {/*                   label="Mapping Group ID"/>*/}
                            {/*</Grid>*/}
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="status"
                                               label="Status"/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <Autocomplete
                                    freeSolo
                                    fullWidth
                                    limitTags={15}
                                    autoComplete={false}
                                    autoHighlight={false}
                                    id="target_class_path"
                                    disableClearable
                                    options={prefixedTerms}
                                    filterOptions={filterTerms}
                                    disableCloseOnSelect={false}
                                    includeInputInList={false}
                                    onChange={
                                        (event, newValue) => onTermsInputChange(
                                            event, newValue, formik, "target_class_path"
                                        )
                                    }
                                    inputValue={formik.values.target_class_path}
                                    renderInput={(params) => (
                                        <FormTextField
                                            formik={formik}
                                            name="target_class_path"
                                            label="Target Class Path"
                                            onBlur={(e) => checkTermsValidity(e.target.name, e.target.value)}
                                            {...params}
                                        />
                                    )}
                                />

                                {targetClassPathValidityInfo && <>
                                    <Alert severity={hasTargetClassPathValidityErrors ? "error" : "success"}
                                           sx={{
                                               my: 2
                                           }}
                                    >{parse(targetClassPathValidityInfo)}</Alert>
                                    <Divider/>
                                </>
                                }
                                {targetClassPathTermsValidityInfo?.map((item, i) =>
                                    <TermValidityInfo key={'target' + i}
                                                      item={item}/>
                                )}
                                {targetClassPathTermsValidityInfo.length > 0 && <Divider/>}
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <Autocomplete
                                    freeSolo
                                    fullWidth
                                    limitTags={15}
                                    autoComplete={false}
                                    autoHighlight={false}
                                    id="target_property_path"
                                    disableClearable
                                    options={prefixedTerms}
                                    filterOptions={filterTerms}
                                    disableCloseOnSelect={false}
                                    includeInputInList={false}
                                    onChange={
                                        (event, newValue) => onTermsInputChange(
                                            event, newValue, formik, "target_property_path"
                                        )
                                    }
                                    inputValue={formik.values.target_property_path}
                                    renderInput={(params) => (
                                        <FormTextField
                                            formik={formik}
                                            name="target_property_path"
                                            label="Target Property Path"
                                            onBlur={(e) => checkTermsValidity(e.target.name, e.target.value)}
                                            {...params}
                                        />
                                    )}
                                />

                                {targetPropertyPathValidityInfo && <>
                                    <Alert severity={hasTargetPropertyPathValidityErrors ? "error" : "success"}
                                           sx={{
                                               my: 2
                                           }}
                                    >{parse(targetPropertyPathValidityInfo)}</Alert>
                                    <Divider/>
                                </>
                                }
                                {targetPropertyPathTermsValidityInfo?.map((item, i) =>
                                    <TermValidityInfo
                                        key={'target' + i}
                                        item={item}/>
                                )}
                                {targetPropertyPathTermsValidityInfo.length > 0 && <Divider/>}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{mt: 3}}>
                    <CardHeader title="Source Structural Element"/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <Grid xs={12}
                                  md={12}>
                                <FormControl sx={{my: 2, width: '100%'}}>
                                    <TextField
                                        fullWidth
                                        label="Structural Element"
                                        onChange={handleSourceStructuralElementSelect}
                                        select
                                        value={formik.values.source_structural_element}
                                    >
                                        <MenuItem value={null}>&nbsp;</MenuItem>
                                        {projectSourceStructuralElements.map((x) => (
                                            <MenuItem key={x.id}
                                                      value={x.id}>{x.label}</MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{mt: 3}}>
                    <CardHeader title="RML Triple Map"/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <Grid xs={12}
                                  md={12}>
                                <FormControl sx={{my: 2, width: '100%'}}>
                                    <TextField
                                        fullWidth
                                        label={genericTripleMapFragmentsApi.SECTION_ITEM_TITLE}
                                        onChange={handleTripleMapFragmentSelect}
                                        select
                                        value={formik.values.triple_map_fragment}
                                    >
                                        <MenuItem value={null}>&nbsp;</MenuItem>
                                        {projectTripleMapFragments.map((x) => (
                                            <MenuItem key={x.id}
                                                      value={x.id}>{x.uri}</MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{mt: 3}}>
                    <CardHeader title="Mapping Packages"/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <Grid xs={12}
                                  md={12}>
                                <MappingPackageCheckboxList
                                    mappingPackages={formik.values.refers_to_mapping_package_ids}
                                    withDefaultPackage={itemctx.isNew}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{mt: 3}}>
                    <CardHeader title="SPARQL Assertions"/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <Grid xs={12}
                                  md={12}>
                                <ResourceListSelector
                                    valuesApi={sparqlTestFileResourcesApi}
                                    listValues={formik.values.sparql_assertions}
                                    initProjectValues={projectSPARQLResources}
                                    titleField="title"
                                    valuesForSelector={sparqlResourcesForSelector}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{mt: 3}}>
                    <CardContent sx={{pb: 1, pt: 3}}>
                        <Typography sx={{fontWeight: "bold"}}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showMappingNotes}
                                        onChange={(e) => setShowMappingNotes(e.target.checked)}
                                    />
                                }
                                label={`Mapping Notes (${formik.values.mapping_notes.length})`}
                            />
                        </Typography>
                    </CardContent>
                    <CardContent sx={{pt: 0}}>
                        {showMappingNotes && <>
                            {formik.values.mapping_notes.map(
                                (mapping_note, idx) => <RuleComment
                                    key={idx}
                                    formik={formik}
                                    fieldName="mapping_notes"
                                    idx={idx}
                                    handleDelete={handleDeleteComment}
                                />
                            )}
                        </>}
                        <Divider sx={{py: 1}}/>
                        <Grid xs={12}
                              md={12}
                              sx={{mt: 1}}>
                            <Stack
                                component={RadioGroup}
                                defaultValue={COMMENT_PRIORITY.NORMAL}
                                name="mapping_note[priority]"
                                spacing={3}
                                onChange={(e) => {
                                    formik.setFieldValue('mapping_note[priority]', e.target.value);
                                }}
                            >
                                <Box sx={{
                                    alignItems: 'flex-start',
                                    display: 'flex',
                                    py: 2,
                                    px: 1
                                }}>
                                    <Box sx={{mr: 2, mt: 1}}>
                                        <b>Priority:</b>
                                    </Box>
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="mapping_note_priority_high"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    High
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.HIGH}
                                        checked={formik.values.mapping_note && formik.values.mapping_note.priority === COMMENT_PRIORITY.HIGH}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="mapping_note_priority_normal"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    Normal
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.NORMAL}
                                        checked={formik.values.mapping_note && formik.values.mapping_note.priority === COMMENT_PRIORITY.NORMAL}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="mapping_note_priority_low"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    Low
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.LOW}
                                        checked={formik.values.mapping_note && formik.values.mapping_note.priority === COMMENT_PRIORITY.LOW}
                                    />
                                </Box>
                            </Stack>
                            <TextField
                                name="mapping_note[comment]"
                                minRows={3}
                                multiline
                                fullWidth
                                label="Add new Mapping Note ..."
                                helperText="... public"
                                value={formik.values.mapping_note && formik.values.mapping_note.comment || ''}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                    </CardContent>

                </Card>
                <Card sx={{mt: 3}}>
                    <CardContent sx={{pb: 1, pt: 3}}>
                        <Typography sx={{fontWeight: "bold"}}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showEditorialNotes}
                                        onChange={(e) => setShowEditorialNotes(e.target.checked)}
                                    />
                                }
                                label={`Editorial Notes (${formik.values.editorial_notes.length})`}
                            />
                        </Typography>
                    </CardContent>
                    <CardContent sx={{pt: 0}}>
                        {showEditorialNotes && <>
                            {formik.values.editorial_notes.map(
                                (editorial_note, idx) => <RuleComment
                                    key={idx}
                                    idx={idx}
                                    formik={formik}
                                    fieldName="editorial_notes"
                                    handleDelete={handleDeleteComment}
                                />
                            )}
                        </>}
                        <Divider sx={{py: 1}}/>
                        <Grid xs={12}
                              md={12}
                              sx={{mt: 1}}>
                            <Stack
                                component={RadioGroup}
                                defaultValue={COMMENT_PRIORITY.NORMAL}
                                name="editorial_note[priority]"
                                spacing={3}
                                onChange={(e) => {
                                    formik.setFieldValue('editorial_note[priority]', e.target.value);
                                }}
                            >
                                <Box sx={{
                                    alignItems: 'flex-start',
                                    display: 'flex',
                                    py: 2,
                                    px: 1
                                }}>
                                    <Box sx={{mr: 2, mt: 1}}>
                                        <b>Priority:</b>
                                    </Box>
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="editorial_note_priority_high"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    High
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.HIGH}
                                        checked={formik.values.editorial_note && formik.values.editorial_note.priority === COMMENT_PRIORITY.HIGH}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="editorial_note_priority_normal"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    Normal
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.NORMAL}
                                        checked={formik.values.editorial_note && formik.values.editorial_note.priority === COMMENT_PRIORITY.NORMAL}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="editorial_note_priority_low"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    Low
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.LOW}
                                        checked={formik.values.editorial_note && formik.values.editorial_note.priority === COMMENT_PRIORITY.LOW}
                                    />
                                </Box>
                            </Stack>
                            <TextField
                                name="editorial_note[comment]"
                                minRows={3}
                                multiline
                                fullWidth
                                label="Add new Editorial Note ..."
                                helperText="... private"
                                value={(formik.values.editorial_note && formik.values.editorial_note?.comment) ?? ''}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                            />

                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{mt: 3}}>
                    <CardContent sx={{pb: 1, pt: 3}}>
                        <Typography sx={{fontWeight: "bold"}}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showFeedbackNotes}
                                        onChange={(e) => setShowFeedbackNotes(e.target.checked)}
                                    />
                                }
                                label={`Feedback Notes (${formik.values.feedback_notes.length})`}
                            />
                        </Typography>
                    </CardContent>
                    <CardContent sx={{pt: 0}}>
                        {showFeedbackNotes && <>
                            {formik.values.feedback_notes.map(
                                (feedback_note, idx) => <RuleComment
                                    key={idx}
                                    idx={idx}
                                    formik={formik}
                                    fieldName="feedback_notes"
                                    handleDelete={handleDeleteComment}
                                />
                            )}
                        </>}
                        <Divider sx={{py: 1}}/>
                        <Grid xs={12}
                              md={12}
                              sx={{mt: 1}}>
                            <Stack
                                component={RadioGroup}
                                defaultValue={COMMENT_PRIORITY.NORMAL}
                                name="feedback_note[priority]"
                                spacing={3}
                                onChange={(e) => {
                                    formik.setFieldValue('feedback_note[priority]', e.target.value);
                                }}
                            >
                                <Box sx={{
                                    alignItems: 'flex-start',
                                    display: 'flex',
                                    py: 2,
                                    px: 1
                                }}>
                                    <Box sx={{mr: 2, mt: 1}}>
                                        <b>Priority:</b>
                                    </Box>
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="feedback_note_priority_high"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    High
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.HIGH}
                                        checked={formik.values.feedback_note && formik.values.feedback_note.priority === COMMENT_PRIORITY.HIGH}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="feedback_note_priority_normal"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    Normal
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.NORMAL}
                                        checked={formik.values.feedback_note && formik.values.feedback_note.priority === COMMENT_PRIORITY.NORMAL}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="feedback_note_priority_low"
                                        label={(
                                            <Box sx={{ml: 0, mr: 1}}>
                                                <Typography
                                                    variant="subtitle2"
                                                >
                                                    Low
                                                </Typography>
                                            </Box>
                                        )}
                                        value={COMMENT_PRIORITY.LOW}
                                        checked={formik.values.feedback_note && formik.values.feedback_note.priority === COMMENT_PRIORITY.LOW}
                                    />
                                </Box>
                            </Stack>
                            <TextField
                                name="feedback_note[comment]"
                                minRows={3}
                                multiline
                                fullWidth
                                label="Add new Feedback Note ..."
                                helperText="... private"
                                value={(formik.values.feedback_note && formik.values.feedback_note?.comment) ?? ''}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                            />

                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{mt: 3}}>
                    <Stack
                        direction={{
                            xs: 'column',
                            sm: 'row'
                        }}
                        flexWrap="wrap"
                        spacing={3}
                        sx={{p: 3}}
                    >
                        <Button
                            disabled={formik.isSubmitting}
                            type="submit"
                            variant="contained"
                        >
                            {itemctx.isNew ? 'Create' : 'Update'}
                        </Button>
                        <Button
                            onClick={handleCloneAction}
                            variant="text"
                            type="button"
                            disabled={formik.isSubmitting}
                            color="warning"
                        >
                            Clone
                        </Button>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            disabled={formik.isSubmitting}
                            href={paths.app.conceptual_mapping_rules.overview.index}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Card>
            </form>
        )
            ;
    }
;

EditForm.propTypes = {
    itemctx: PropTypes.object.isRequired
};
