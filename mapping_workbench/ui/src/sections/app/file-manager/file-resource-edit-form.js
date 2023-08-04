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
import {useCallback} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {FormTextArea} from "../../../components/app/form/text-area";
import {FormTextField} from "../../../components/app/form/text-field";


export const FileResourceEditForm = (props) => {
    const router = useRouter();
    if (!router.isReady) return;

    const {itemctx, collection_id, ...other} = props;
    const sectionApi = itemctx.api;
    const item = itemctx.data;

    const initFormValues = (data) => {
        return {
            title: data.title || '',
            description: data.description || '',
            format: data.format || '',
            content: data.content || '',
            file: null
        }
    }

    let initialValues = initFormValues(item);

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
            try {
                console.log(values);
                let response;
                let formData = values;
                if (itemctx.isNew) {
                    response = await sectionApi.createCollectionFileResource(collection_id, formData);
                } else {
                    response = await sectionApi.updateFileResource(item._id, formData);
                }

                helpers.setStatus({success: true});
                helpers.setSubmitting(false);
                toast.success(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "created" : "updated"));
                if (response) {
                    if (itemctx.isNew) {
                        router.push({
                            pathname: paths.app[sectionApi.section].file_manager.edit,
                            query: {id: collection_id, fid: response._id}
                        });
                    } else {
                        router.reload();
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

    const handleFile = useCallback((e) => {
        formik.values.file = e.target.files[0];
    }, [formik]);

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
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="title" label="Title" required={true}/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextArea formik={formik} name="description" label="Description"/>
                        </Grid>
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
                                    {Object.keys(sectionApi.FILE_RESOURCE_FORMATS).map((key) => {
                                        return (
                                            <MenuItem value={key} key={key}>
                                                {sectionApi.FILE_RESOURCE_FORMATS[key]}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextArea formik={formik} name="content" label="Content"/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <Button variant="contained" component="label">
                                Upload File
                                <input type="file" name="file" onChange={handleFile}/>
                            </Button>
                        </Grid>
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
