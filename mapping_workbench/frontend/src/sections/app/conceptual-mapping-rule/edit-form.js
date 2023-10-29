import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

import {RouterLink} from 'src/components/router-link';
import {paths} from 'src/paths';
import {useRouter} from 'src/hooks/use-router';
import {FormTextField} from "../../../components/app/form/text-field";
import {FormTextArea} from "../../../components/app/form/text-area";
import {sessionApi} from "../../../api/session";
import {MappingPackageCheckboxList} from "../mapping-package/components/mapping-package-checkbox-list";
import {genericTripleMapFragmentsApi} from "../../../api/triple-map-fragments/generic";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {sparqlTestFileResourcesApi} from "../../../api/sparql-test-suites/file-resources";
import {ListSelectorSelect as ResourceListSelector} from "../../../components/app/list-selector/select";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";


import parse from 'html-react-parser';
import {Box} from "@mui/system";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import {COMMENT_PRIORITY} from "../../../api/conceptual-mapping-rules";
import Switch from "@mui/material/Switch";
import Menu from "@mui/material/Menu";
import {Dropdown} from "../../../components/dropdown";
import Autocomplete from "@mui/material/Autocomplete";

const TermValidityInfo = (props) => {
    const {item, ...other} = props;

    let severity = 'success';
    let info = `is a known term`;
    let term = item.term
    if (!item.is_valid) {
        severity = 'error';
        info = `is an unknown term`;
    }
    return (
        <Alert severity={severity}
               sx={{
                   my: 2
               }}
        ><b color="success">{term}</b> {info}</Alert>
    )
}

const RuleComment = (props) => {
    let {formik, fieldName, idx, handleDelete, ...other} = props;

    let comment = formik.values[fieldName][idx];
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
                <input name={titleName} value={comment.title} type="hidden"/>
                <input name={commentName} value={comment.comment} type="hidden"/>
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

        const [showComments, setShowComments] = useState(false);
        const [showNotes, setShowNotes] = useState(false);
        const [targetPropertyPathValidityInfo, setTargetPropertyPathValidityInfo] = useState("");
        const [targetPropertyPathTermsValidityInfo, setTargetPropertyPathTermsValidityInfo] = useState([]);
        const [targetClassPathValidityInfo, setTargetClassPathValidityInfo] = useState("");
        const [targetClassPathTermsValidityInfo, setTargetClassPathTermsValidityInfo] = useState([]);

        const checkTermsValidity = useCallback((elName, value, hasNotification = true) => {
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
                toast.promise(checkTermsValidityPromise, {
                    loading: `Checking terms validity ... `,
                    success: (termsValidity) => {
                        checkTermsValidityOnSuccess(termsValidity);
                        return `Terms checked for validity.`;
                    },
                    error: (err) => `Checking terms validity failed: ${err.message}.`
                }).then(r => {
                })
            } else {
                checkTermsValidityPromise.then(termsValidity => {
                    checkTermsValidityOnSuccess(termsValidity);
                })
            }
        }, [sectionApi])

        const prepareTextareaListValue = (value) => {
            return (value && (value.join('\n') + ['\n'])) || ''
        }

        const initComment = () => {
            return {
                title: '',
                comment: '',
                priority: COMMENT_PRIORITY.NORMAL
            }
        }

        let initialValues = {
            field_id: item.field_id || '',
            field_title: item.field_title || '',
            field_description: item.field_description || '',
            source_xpath: prepareTextareaListValue(item.source_xpath),
            target_class_path: item.target_class_path || '',
            target_property_path: item.target_property_path || '',
            mapping_packages: (item.mapping_packages || []).map(x => x.id),
            sparql_assertions: (item.sparql_assertions || []).map(x => x.id),
            triple_map_fragment: (item.triple_map_fragment && item.triple_map_fragment.id) || '',
            notes: (item.notes || []),
            comments: (item.comments || []),
            note: initComment(),
            comment: initComment()
        };

        const formik = useFormik({
            initialValues: initialValues,
            validationSchema: Yup.object({
                field_id: Yup
                    .string()
                    .max(255)
                    .required('Field ID is required'),
                field_title: Yup
                    .string()
                    .max(255),
                field_description: Yup.string().max(2048)
            }),
            onSubmit: async (values, helpers) => {
                try {
                    let requestValues = values;
                    if (values['comment']['comment']) {
                        values['comments'].push(values['comment']);
                    }
                    delete values['comment'];

                    if (values['note']['comment']) {
                        values['notes'].push(values['note']);
                    }
                    delete values['note'];

                    requestValues['source_xpath'] = (typeof values['source_xpath'] == 'string') ?
                        values['source_xpath'].split('\n').map(s => s.trim()).filter(s => s !== '') : values['source_xpath'];
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
                    toast.success(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "created" : "updated"));
                    if (response) {
                        if (itemctx.isNew) {
                            router.push({
                                pathname: paths.app[sectionApi.section].edit,
                                query: {id: response._id}
                            });
                        } else if (itemctx.isStateable) {
                            itemctx.setState(response);
                            formik.values.source_xpath = prepareTextareaListValue(response['source_xpath']);
                            formik.values.note = initComment();
                            formik.values.comment = initComment();
                        }
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Something went wrong!');
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    helpers.setSubmitting(false);
                }
            }
        });


        const handleTripleMapFragmentSelect = useCallback((e) => {
            let value = e.target.value;
            formik.setFieldValue('triple_map_fragment', value);
        }, [formik]);

        const sparqlResourcesForSelector = function (filters = {}) {
            return sparqlTestFileResourcesApi.getMappingRuleResources(filters);
        }

        useEffect(() => {
            checkTermsValidity('target_property_path', formik.values.target_property_path, false)
            checkTermsValidity('target_class_path', formik.values.target_class_path, false)
        }, [])

        const handleCloneAction = useCallback(async (e) => {
            toast.promise(sectionApi.cloneItem(item._id), {
                loading: `Cloning rule ... `,
                success: (response) => {
                    router.push({
                        pathname: paths.app[sectionApi.section].edit,
                        query: {id: response._id}
                    });
                    itemctx.setState(response);
                    return `Rule successfully cloned.`
                },
                error: (err) => `Cloning rule failed: ${err.message}.`
            })

            return false;

        }, [router, sectionApi, item, itemctx]);

        const handleDeleteComment = useCallback((idx, fieldName) => {
            let values = formik.values[fieldName]
            formik.setFieldValue(fieldName, values.slice(0, idx).concat(values.slice(idx + 1)));
        }, [formik]);

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

        const [projectTripleMapFragments, setProjectTripleMapFragments] = useState([]);
        const [projectSPARQLResources, setProjectSPARQLResources] = useState([]);

        useEffect(() => {
            (async () => {
                setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getValuesForSelector());
                setProjectSPARQLResources(await sparqlTestFileResourcesApi.getMappingRuleResources());
                setIsProjectDataReady(true);
            })()
        }, [])

        if (!isProjectDataReady) return null;

        return (
            <form onSubmit={formik.handleSubmit} {...other}>
                <Card>
                    <CardHeader title={(itemctx.isNew ? 'Create' : 'Edit') + ' ' + sectionApi.SECTION_ITEM_TITLE}/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container spacing={3}>
                            <Grid xs={12} md={12}>
                                <FormTextField formik={formik} name="field_id" label="Field ID" required={true}/>
                            </Grid>
                            <Grid xs={12} md={12}>
                                <FormTextField formik={formik} name="field_title" label="Field Title"/>
                            </Grid>
                            <Grid xs={12} md={12}>
                                <FormTextArea formik={formik} name="field_description" label="Field Description"/>
                            </Grid>
                            <Grid xs={12} md={12}>
                                <FormTextArea formik={formik} name="source_xpath" label="Source XPaths"/>
                            </Grid>
                            <Grid xs={12} md={12}>
                                <Autocomplete
                                    freeSolo
                                    fullWidth
                                    limitTags={15}
                                    autoComplete={false}
                                    autoHighlight={false}
                                    id="target_class_path"
                                    disableClearable={true}
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
                                            name="target_class_path" label="Target Class Path"
                                            onBlur={(e) => checkTermsValidity(
                                                e.target.name, e.target.value
                                            )}
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
                                {targetClassPathTermsValidityInfo.length > 0 && targetClassPathTermsValidityInfo.map(
                                    (item) => <TermValidityInfo item={item}/>
                                )}
                                {targetClassPathTermsValidityInfo.length > 0 && <Divider/>}
                            </Grid>
                            <Grid xs={12} md={12}>
                                <Autocomplete
                                    freeSolo
                                    fullWidth
                                    limitTags={15}
                                    autoComplete={false}
                                    autoHighlight={false}
                                    id="target_property_path"
                                    disableClearable={true}
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
                                            name="target_property_path" label="Target Property Path"
                                            onBlur={(e) => checkTermsValidity(
                                                e.target.name, e.target.value
                                            )}
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
                                {targetPropertyPathTermsValidityInfo.length > 0 && targetPropertyPathTermsValidityInfo.map(
                                    (item) => <TermValidityInfo item={item}/>
                                )}
                                {targetPropertyPathTermsValidityInfo.length > 0 && <Divider/>}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{mt: 3}}>
                    <CardHeader title="RML Triple Map"/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container spacing={3}>
                            <Grid xs={12} md={12}>
                                <FormControl sx={{my: 2, width: '100%'}}>
                                    <TextField
                                        fullWidth
                                        label={genericTripleMapFragmentsApi.SECTION_ITEM_TITLE}
                                        onChange={handleTripleMapFragmentSelect}
                                        select
                                        value={formik.values.triple_map_fragment}
                                    >
                                        <MenuItem key="" value={null}>&nbsp;</MenuItem>
                                        {projectTripleMapFragments.map((x) => (
                                            <MenuItem key={x.id} value={x.id}>{x.uri}</MenuItem>
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
                        <Grid container spacing={3}>
                            <Grid xs={12} md={12}>
                                <MappingPackageCheckboxList mappingPackages={formik.values.mapping_packages}/>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Card sx={{mt: 3}}>
                    <CardHeader title="SPARQL Assertions"/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container spacing={3}>
                            <Grid xs={12} md={12}>
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
                                        checked={showNotes}
                                        onChange={(e) => setShowNotes(e.target.checked)}
                                    />
                                }
                                label={`Notes (${formik.values.notes.length})`}
                            />
                        </Typography>
                    </CardContent>
                    <CardContent sx={{pt: 0}}>
                        {showNotes && <>
                            {formik.values.notes.map(
                                (note, idx) => <RuleComment
                                    formik={formik}
                                    fieldName="notes" idx={idx} handleDelete={handleDeleteComment}
                                />
                            )}
                        </>}
                        <Divider sx={{py: 1}}/>
                        <Grid xs={12} md={12} sx={{mt: 1}}>
                            <Stack
                                component={RadioGroup}
                                defaultValue={COMMENT_PRIORITY.NORMAL}
                                name="note[priority]"
                                spacing={3}
                                onChange={(e) => {
                                    formik.setFieldValue('note[priority]', e.target.value);
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
                                        key="note_priority_high"
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
                                        checked={formik.values.note.priority === COMMENT_PRIORITY.HIGH}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="note_priority_normal"
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
                                        checked={formik.values.note.priority === COMMENT_PRIORITY.NORMAL}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="note_priority_low"
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
                                        checked={formik.values.note.priority === COMMENT_PRIORITY.LOW}
                                    />
                                </Box>
                            </Stack>
                            <TextField
                                name="note[comment]"
                                minRows={3}
                                multiline
                                fullWidth
                                label="Add new Note ..."
                                helperText="... for external viewers"
                                value={formik.values.note.comment}
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
                                        checked={showComments}
                                        onChange={(e) => setShowComments(e.target.checked)}
                                    />
                                }
                                label={`Comments (${formik.values.comments.length})`}
                            />
                        </Typography>
                    </CardContent>
                    <CardContent sx={{pt: 0}}>
                        {showComments && <>
                            {formik.values.comments.map(
                                (comment, idx) => <RuleComment
                                    formik={formik}
                                    fieldName="comments" idx={idx} handleDelete={handleDeleteComment}
                                />
                            )}
                        </>}
                        <Divider sx={{py: 1}}/>
                        <Grid xs={12} md={12} sx={{mt: 1}}>
                            <Stack
                                component={RadioGroup}
                                defaultValue={COMMENT_PRIORITY.NORMAL}
                                name="comment[priority]"
                                spacing={3}
                                onChange={(e) => {
                                    formik.setFieldValue('comment[priority]', e.target.value);
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
                                        key="comment_priority_high"
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
                                        checked={formik.values.comment.priority === COMMENT_PRIORITY.HIGH}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="comment_priority_normal"
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
                                        checked={formik.values.comment.priority === COMMENT_PRIORITY.NORMAL}
                                    />
                                    <FormControlLabel
                                        control={<Radio/>}
                                        key="comment_priority_low"
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
                                        checked={formik.values.comment.priority === COMMENT_PRIORITY.LOW}
                                    />
                                </Box>
                            </Stack>
                            <TextField
                                name="comment[comment]"
                                minRows={3}
                                multiline
                                fullWidth
                                label="Add new Comment ..."
                                helperText="... for other editors"
                                value={formik.values.comment.comment}
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
                            onClick={(e) => handleCloneAction(e)}
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
                            href={paths.app.conceptual_mapping_rules.index}
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
