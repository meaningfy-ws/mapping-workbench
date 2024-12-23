import {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import Box from "@mui/system/Box";
import Card from '@mui/material/Card';
import Radio from "@mui/material/Radio";
import Stack from '@mui/material/Stack';
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import CardContent from '@mui/material/CardContent';
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";

import {paths} from 'src/paths';
import {sessionApi} from "src/api/session";
import {useRouter} from 'src/hooks/use-router';
import {RouterLink} from 'src/components/router-link';
import {fieldsRegistryApi} from "src/api/fields-registry";
import {FormTextField} from "src/components/app/form/text-field";
import {COMMENT_PRIORITY} from "src/api/conceptual-mapping-rules";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {genericTripleMapFragmentsApi} from "src/api/triple-map-fragments/generic";
import {sparqlTestFileResourcesApi} from "src/api/sparql-test-suites/file-resources";
import {ListSelectorSelect as ResourceListSelector} from "src/components/app/list-selector/select";
import {MappingPackageCheckboxList} from '../mapping-package/components/mapping-package-real-checkbox-list';

import {TermValidityInfo} from "./term-validity";
import {FormCodeTextArea} from "src/components/app/form/code-text-area";
import 'prismjs/components/prism-xquery';


const RuleComment = ({formik, fieldName, idx, handleDelete, ...other}) => {

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

        const [isProjectDataReady, setIsProjectDataReady] = useState(0);

        const [prefixedTerms, setPrefixedTerms] = useState([]);
        const [projectSourceStructuralElements, setProjectSourceStructuralElements] = useState([]);
        const [projectTripleMapFragments, setProjectTripleMapFragments] = useState([]);
        const [projectSPARQLResources, setProjectSPARQLResources] = useState([]);

        useEffect(() => {
            checkTermsValidity('target_property_path', formik.values.target_property_path, false)
            checkTermsValidity('target_class_path', formik.values.target_class_path, false)

            sectionApi.getPrefixedTerms()
                .then(res => setPrefixedTerms(res))
                .catch(err => console.error(err))

            fieldsRegistryApi.getStructuralElementsForSelector()
                .then(res => {
                    setProjectSourceStructuralElements(res)
                    setIsProjectDataReady(e => e++)
                })
                .catch(err => console.error(err))

            genericTripleMapFragmentsApi.getValuesForSelector()
                .then(res => {
                    setProjectTripleMapFragments(res)
                    setIsProjectDataReady(e => e++)

                })
                .catch(err => console.error(err))

            sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions()
                .then(res => {
                    setProjectSPARQLResources(res)
                    setIsProjectDataReady(e => e++)
                })
                .catch(err => console.error(err))
        }, [])


        const checkTermsValidity = (elName, value, hasNotification = true) => {
            const checkTermsValidityOnSuccess = (termsValidity) => {
                let validityInfo = value;
                termsValidity.forEach(termValidity => {
                        const color = termValidity.is_valid ? 'green' : 'red'
                        validityInfo = validityInfo.replace(
                            new RegExp(`\\b${termValidity.term}\\b`, 'g'),
                            `<b style="color: ${color}">${termValidity.term}</b>`
                        )
                    }
                )

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

        const initComment = {
            title: '',
            comment: '',
            priority: COMMENT_PRIORITY.NORMAL
        }

        const initialValues = {
            source_structural_element: item.source_structural_element?.id ?? '',
            xpath_condition: item.xpath_condition ?? '',
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
            mapping_note: initComment,
            editorial_note: initComment,
            feedback_note: initComment
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
                            formik.values.mapping_note = initComment;
                            formik.values.editorial_note = initComment;
                            formik.values.feedback_note = initComment;
                        }
                    }
                } catch (err) {
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

        const sparqlResourcesForSelector = (filters = {}) => sparqlTestFileResourcesApi.getMappingRuleSPARQLAssertions(filters);

        const handleCloneAction = () => {
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


        const filterTerms = (options, {inputValue}) => {
            const lastTerm = inputValue.split(' ').pop();
            if (lastTerm?.length >= 3) {
                const regex = new RegExp(`${lastTerm}`, 'i');
                return options.filter(term => regex.test(term));
            }
            return [];
        }

        const onTermsInputChange = (event, term, formik, fieldName) => {
            let inputValue = formik.values[fieldName];
            if (term !== inputValue) {
                const lastTerm = inputValue.split(' ').pop();
                const fieldValue = inputValue.replace(new RegExp(`\\b${lastTerm}$`), `${term}`)
                formik.setFieldValue(fieldName, fieldValue);
            }
        }

        if (isProjectDataReady >= 3) return <CircularProgress/>;
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
                                               label="Min XSD Version"/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="max_sdk_version"
                                               label="Max XSD Version"/>
                            </Grid>
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
                                {!!targetClassPathTermsValidityInfo.length && <Divider/>}
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
                                        (event, newValue) =>
                                            onTermsInputChange(event, newValue, formik, "target_property_path")
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
                                {!!targetPropertyPathTermsValidityInfo.length && <Divider/>}
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
                                        required={true}
                                        value={formik.values.source_structural_element}
                                    >
                                        <MenuItem value={null}>&nbsp;</MenuItem>
                                        {projectSourceStructuralElements?.map(e =>
                                            <MenuItem key={e.id}
                                                      value={e.id}>{e.label}</MenuItem>
                                        )}
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormCodeTextArea
                                    formik={formik}
                                    name="xpath_condition"
                                    label="XPath Condition"
                                    language_grammar={Prism.languages.xquery}
                                    language="xquery"
                                    height={150}
                                />
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
                                        {projectTripleMapFragments?.map(e =>
                                            <MenuItem key={e.id}
                                                      value={e.id}>{e.uri}</MenuItem>
                                        )}
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
                                    handleUpdate={values => formik.setFieldValue('refers_to_mapping_package_ids',values)}
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
                                (mapping_note, id) => <RuleComment
                                    key={id}
                                    formik={formik}
                                    fieldName="mapping_notes"
                                    idx={id}
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
                                        onChange={e => setShowEditorialNotes(e.target.checked)}
                                    />
                                }
                                label={`Editorial Notes (${formik.values.editorial_notes.length})`}
                            />
                        </Typography>
                    </CardContent>
                    <CardContent sx={{pt: 0}}>
                        {showEditorialNotes && formik.values.editorial_notes.map((editorial_note, idx) =>
                            <RuleComment
                                key={idx}
                                idx={idx}
                                formik={formik}
                                fieldName="editorial_notes"
                                handleDelete={handleDeleteComment}
                            />
                        )}
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
                                        onChange={e => setShowFeedbackNotes(e.target.checked)}
                                    />
                                }
                                label={`Feedback Notes (${formik.values.feedback_notes.length})`}
                            />
                        </Typography>
                    </CardContent>
                    <CardContent sx={{pt: 0}}>
                        {showFeedbackNotes && formik.values.feedback_notes.map(
                            (feedback_note, id) => <RuleComment
                                key={id}
                                idx={id}
                                formik={formik}
                                fieldName="feedback_notes"
                                handleDelete={handleDeleteComment}
                            />
                        )}
                        <Divider sx={{py: 1}}/>
                        <Grid xs={12}
                              md={12}
                              sx={{mt: 1}}>
                            <Stack
                                component={RadioGroup}
                                defaultValue={COMMENT_PRIORITY.NORMAL}
                                name="feedback_note[priority]"
                                spacing={3}
                                onChange={e => {
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
