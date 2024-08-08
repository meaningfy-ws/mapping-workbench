import {useEffect, useState} from 'react';

import {useFormik} from "formik";
import * as Yup from "yup";

import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

import {Layout as AppLayout} from 'src/layouts/app';
import File from 'src/sections/app/fields-and-nodes/file'
import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'
import {schemaFileResourcesApi as schemaFiles} from 'src/api/schema-files/file-resources'
import {FormTextField} from "../../../components/app/form/text-field";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import {paths} from "../../../paths";
import RelativeXpathFinder from "../../../sections/app/fields-and-nodes/relative-xpath-finder";

const Page = () => {
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState({})
    const [xPaths, setXPaths] = useState([])

    useEffect(() => {
        schemaFiles.getItems({})
            .then(res => {
                setFiles(res)
            })
            .catch(err => console.error(err))

        fieldsRegistry.getXpathsList()
            .then(res => {
                console.log(res)
                setXPaths(res)
            })
            .catch(err => console.error(err))
    }, [])

    const onChangeXPath = (value) => {
        formik.setFieldValue('xpath', value)
    }

    const initialValues = {
        id: '',
        label: '',
        xpath: '',
        relative_xpath: '',
        parent_node: ''
    };

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            id: Yup
                .string()
                .max(255)
                .required('Id is required'),
            label: Yup
                .string()
                .max(255)
                .required('Label is required'),
            xpath: Yup
                .string()
                .max(255)
                .required('XPath is required'),
        }),
        onSubmit: async (values, helpers) => {
            const toastId = toastLoad(itemctx.isNew ? "Creating..." : "Updating...")
            try {
                let response;
                if (itemctx.isNew) {
                    response = await sectionApi.createItem(values);
                } else {
                    values['id'] = item._id;
                    response = await sectionApi.updateItem(values);
                }
                helpers.setStatus({success: true});
                helpers.setSubmitting(false);
                toastSuccess(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "Created" : "Updated"), toastError());
                if (response) {
                    if (itemctx.isNew) {
                        router.push({
                            pathname: paths.app[sectionApi.section].edit,
                            query: {id: response._id}
                        });
                    } else if (itemctx.isStateable) {
                        itemctx.setState(response);
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

    const parentNodeSelect = xPaths.map(e => ({
        label: `${e.parent_node_id} : ${e.relative_xpath}`,
        id: e.id,
        parent_node: e.parent_node_id,
        relative_xpath: e.relative_xpath,
        xpath: e.xpath
    }))
    console.log(parentNodeSelect)



    return (
        <Card sx={{p: 2}}>
            <Grid container
                  justifyContent='center'>
                <Grid container>
                    <Grid item
                          md={12}
                          xl={6}>
                        <Stack gap={2}>
                            <TextField
                                fullWidth
                                label="File"
                                name="fileSelect"
                                onChange={event => setSelectedFile(event.target.value)}
                                value={files[0]}
                                select
                            >
                                {files.map((file) => (
                                    <MenuItem
                                        key={file.filename}
                                        value={file}
                                    >
                                        <Typography>
                                            {file.filename}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </TextField>
                            <File xmlContent={selectedFile.content}
                                  xPaths={xPaths}
                                  handleClick={onChangeXPath}/>
                        </Stack>
                    </Grid>
                    <Grid item
                          md={12}
                          xl={6}>
                        <Stack gap={2}>
                            <FormTextField
                                formik={formik}
                                name="id"
                                label="Id"
                                required/>
                            <FormTextField
                                formik={formik}
                                name="label"
                                label="Label"
                                required/>
                            <FormTextField
                                formik={formik}
                                multiline
                                name="xpath"
                                label="xPath"
                                required/>
                            <Autocomplete
                                // disablePortal
                                id="parent_node"
                                // formik={formik}
                                error={!!(formik.touched['parent_node'] && formik.errors['parent_node'])}
                                helperText={formik.touched['parent_node'] && formik.errors['parent_node']}
                                onBlur={formik.handleBlur}
                                // onChange={formik.handleChange}
                                onChange={(e,value) => formik.setFieldValue('parent_node',value)}
                                value={formik.values?.['parent_node']?.label}
                                options={parentNodeSelect}
                                renderOption={(props, option) =>
                                    <li {...props}
                                        key={option.id}>
                                        {option.xpath}
                                    </li>}
                                renderInput={(params) =>
                                    <TextField {...params}
                                               label="Parent Node"/>
                                }
                            />
                            <RelativeXpathFinder formik={formik}
                                                 xmlContent={selectedFile.content}
                                                 absolute_xpath={formik.values.xpath}
                                                 xpath={formik.values?.parent_node?.xpath}/>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid sx={{justifyContent: 'center'}}><Button>Save</Button><Button>Clear</Button></Grid>
            </Grid>
        </Card>
    )
}


Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
