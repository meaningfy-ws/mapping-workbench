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
import Alert from "@mui/material/Alert";
import {parseString} from "xml2js";

const Page = () => {
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState({})
    const [fileError, setFileError] = useState('')
    const [xmlNodes, setXmlNodes] = useState({})
    const [xPaths, setXPaths] = useState([])
    const [xmlContent, setXmlContent] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        schemaFiles.getItems({})
            .then(res => {
                setFiles(res)
            })
            .catch(err => console.error(err))

        fieldsRegistry.getXpathsList()
            .then(res => {
                setXPaths(res)
            })
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        // Parse the XML string into a DOM Document
        setFileError('')
        setXmlNodes('')
        if (selectedFile.content) {
            try {
                parseString(selectedFile.content, {explicitArray: false}, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        setFileError(err)
                    } else {
                        setXmlNodes(result)
                    }
                });
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(selectedFile.content, "application/xml");
                setXmlContent(xmlDoc)

            } catch (err) {
                setXmlContent('')
                setFileError(err)
            }
        }

    }, [selectedFile])

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
            relative_xpath: Yup
                .string()
                .required('Parent Node is required')

        }),
        onSubmit: async (values, helpers) => {
            console.warn('submit')
            const toastId = toastLoad("Saving...")
            setSaving(true)
            helpers.setSubmitting(true);
            try {
                let response;
                setTimeout(() => {
                    setSaving(false)
                                    helpers.setStatus({success: true});
                helpers.setSubmitting(false);
                    toastSuccess("Saved",toastId)
                }, 2000)
                // helpers.setStatus({success: true});
                // helpers.setSubmitting(false);
                // toastSuccess(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "Created" : "Updated"), toastError());

                // if (response) {
                //     if (itemctx.isNew) {
                //         router.push({
                //             pathname: paths.app[sectionApi.section].edit,
                //             query: {id: response._id}
                //         });
                //     } else if (itemctx.isStateable) {
                //         itemctx.setState(response);
                //     }
                // }
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
        id: e.id,
        label: `${e.parent_node_id} : ${e.relative_xpath}`,
        xpath: e.xpath,
        parent_node: e.parent_node_id,
        relative_xpath: e.relative_xpath
    }))

    const handleClear = () => {
        formik.setValues(initialValues)
    }

    return (
        <form onSubmit={formik.handleSubmit}>
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
                                    onChange={event => {
                                        setSelectedFile(event.target.value)
                                        handleClear()
                                    }}
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
                                {fileError
                                    ? <Alert severity="error">{fileError.message}</Alert>
                                    : <File xmlContent={xmlContent}
                                            xmlNodes={xmlNodes}
                                            xPaths={xPaths}
                                            error={fileError}
                                            fileContent={selectedFile.content}
                                            handleClick={onChangeXPath}/>
                                }
                            </Stack>
                        </Grid>
                        <Grid item
                              md={12}
                              xl={6}>
                            <Stack gap={2}>
                                <FormTextField
                                    formik={formik}
                                    disabled={saving}
                                    name="id"
                                    label="Id"
                                    required/>
                                <FormTextField
                                    formik={formik}
                                    disabled={saving}
                                    name="label"
                                    label="Label"
                                    required/>
                                <FormTextField
                                    formik={formik}
                                    disabled={saving}
                                    multiline
                                    name="xpath"
                                    label="xPath"
                                    required/>
                                <Autocomplete
                                    id="parent_node"
                                    disabled={saving}
                                    // key={formik.values.parent_node.label}
                                    error={!!(formik.touched['parent_node'] && formik.errors['parent_node'])}
                                    helperText={formik.touched['parent_node'] && formik.errors['parent_node']}
                                    onBlur={formik.handleBlur}
                                    onChange={(e, value) => formik.setFieldValue('parent_node', value)}
                                    value={formik.values?.['parent_node']?.label ?? ''}
                                    options={parentNodeSelect}
                                    renderOption={(props, option) =>
                                        <li {...props}
                                            key={option.id}>
                                            {option.xpath}
                                        </li>}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                                   required
                                                   label="Parent Node"/>
                                    }
                                />
                                <RelativeXpathFinder formik={formik}
                                                     error={fileError}
                                                     xmlContent={xmlContent}
                                                     absolute_xpath={formik.values.xpath}
                                                     xpath={formik.values?.parent_node?.xpath}/>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid sx={{justifyContent: 'center'}}>
                        <Button type='submit'
                                disabled={!!fileError || !xmlContent || formik.isSubmitting}>Save</Button>
                        <Button onClick={handleClear}>Clear</Button>
                    </Grid>
                </Grid>
            </Card>
        </form>
    )
}


Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
