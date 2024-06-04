import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useFormik} from 'formik';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import {paths} from 'src/paths';
import {sessionApi} from "src/api/session";
import {useRouter} from 'src/hooks/use-router';
import {RouterLink} from 'src/components/router-link';
import {FormTextArea} from "src/components/app/form/text-area";
import {FormTextField} from "src/components/app/form/text-field";
import {FormCodeTextArea} from "src/components/app/form/code-text-area";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";

export const FileResourceEditForm = (props) => {
    const router = useRouter();

    const {itemctx, collection_id,
        extra_form = null,
        extra_form_fields = {},
        ...other} = props;
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const prepareTextareaListValue = (value) => {
        return (value && (value.join('\n') + ['\n'])) || ''
    }

    const initFormValues = (data) => {
        return Object.assign({
            title: data.title || '',
            description: data.description || '',
            path: prepareTextareaListValue(data.path),
            filename: data.filename || '',
            format: data.format || sectionApi.FILE_RESOURCE_DEFAULT_FORMAT || '',
            content: data.content || '',
            file: null
        }, extra_form_fields)
    }

    const initialValues = initFormValues(item);

    if (sectionApi.hasFileResourceType) {
        initialValues['type'] = item.type ?? '';
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            title: Yup
                .string()
                .max(255)
                .required('Title is required'),
            description: Yup.string().max(2048),
            format: Yup
                .string()
                .max(255)
                .required('Format is required'),
        }),
        onSubmit: async (values, helpers) => {
            const toastId = toastLoad(itemctx.isNew ? "Creating..." : "Updating...")
            try {
                values['path'] = (typeof values['path'] == 'string') ?
                    values['path'].split('\n').map(s => s.trim()).filter(s => s !== '').join(',') : values['path'];
                let response;

                values['project'] = sessionApi.getSessionProject();

                const formData = values;

                if (itemctx.isNew) {
                    response = await sectionApi.createCollectionFileResource(collection_id, formData);
                } else {
                    response = await sectionApi.updateFileResource(item._id, formData);
                }

                helpers.setStatus({success: true});
                helpers.setSubmitting(false);
                toastSuccess(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "Created" : "Updated"), toastId);
                if (response) {
                    if (itemctx.isNew) {
                        router.push({
                            pathname: paths.app[sectionApi.section].resource_manager.index,
                            query: {id: collection_id, fid: response._id}
                        });
                    } else {
                        router.reload();
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

    const handleFile = e => {
        formik.values.file = e.target.files[0];
    }

    return (
        <form encType="multipart/form-data"
              onSubmit={formik.handleSubmit}
              {...other}>
            <Card>
                <CardHeader
                    title={(itemctx.isNew ? 'Create' : 'Edit') + ' ' + sectionApi.SECTION_ITEM_TITLE}/>
                <CardContent sx={{pt: 0}}>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="title"
                                           label="Title"
                                           required={true}/>
                        </Grid>
                        {sectionApi.hasFileResourceType && (
                            <Grid xs={12}
                                  md={12}>
                                <TextField
                                    error={!!(formik.touched.type && formik.errors.type)}
                                    fullWidth
                                    helperText={formik.touched.type && formik.errors.type}
                                    onBlur={formik.handleBlur}
                                    label="Type"
                                    onChange={e => {
                                        formik.setFieldValue("type", e.target.value);
                                    }}
                                    select
                                    required
                                    value={formik.values.type}
                                >
                                    <MenuItem value={null}>&nbsp;</MenuItem>
                                    {Object.keys(sectionApi.FILE_RESOURCE_TYPES).map((key) => (
                                        <MenuItem key={key}
                                                  value={key}>
                                            {sectionApi.FILE_RESOURCE_TYPES[key]}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                        <Grid xs={12}
                              md={12}>
                            <FormTextArea formik={formik}
                                          name="description"
                                          label="Description"/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <FormTextArea formik={formik}
                                          name="path"
                                          label="Path"/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="filename"
                                           label="Filename"/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <TextField
                                error={!!(formik.touched.format && formik.errors.format)}
                                fullWidth
                                helperText={formik.touched.format && formik.errors.format}
                                onBlur={formik.handleBlur}
                                label="Format"
                                onChange={e => {
                                    formik.setFieldValue("format", e.target.value);
                                }}
                                select
                                required
                                value={formik.values.format}
                            >
                                {Object.keys(sectionApi.FILE_RESOURCE_FORMATS).map((key) => (
                                    <MenuItem key={key}
                                              value={key}>
                                        {sectionApi.FILE_RESOURCE_FORMATS[key]}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <FormCodeTextArea
                                formik={formik}
                                name="content"
                                label="Content"
                                grammar={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['grammar']}
                                language={sectionApi.FILE_RESOURCE_CODE[formik.values.format]['language']}
                            />
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <Button variant="contained"
                                    component="label">
                                Upload File
                                <input type="file"
                                       name="file"
                                       onChange={handleFile}/>
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {extra_form && (
                <Card sx={{mt: 3}}>
                    <CardContent>
                        {extra_form({item: item, formik: formik})}
                    </CardContent>
                </Card>
            )}
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
                        {formik.isSubmitting && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: "primary",
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                        {itemctx.isNew ? 'Create' : 'Update'}
                    </Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        disabled={formik.isSubmitting}
                        href={paths.app[sectionApi.section].index}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Card>
        </form>
    );
};

FileResourceEditForm.propTypes = {
    itemctx: PropTypes.object.isRequired
};
