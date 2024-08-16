import {useEffect, useState} from 'react';

import {useFormik} from "formik";
import * as Yup from "yup";
import {parseString} from "xml2js";

import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";

import {Layout as AppLayout} from 'src/layouts/app';
import File from 'src/sections/app/fields-and-nodes/file'
import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'
import {testDataSuitesApi as sectionApi, testDataSuitesApi} from "../../../api/test-data-suites";
import {FormTextField} from "../../../components/app/form/text-field";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import RelativeXpathFinder from "../../../sections/app/fields-and-nodes/relative-xpath-finder";
import {Seo} from "../../../components/seo";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {BreadcrumbsSeparator} from "../../../components/breadcrumbs-separator";
import Link from "@mui/material/Link";
import {RouterLink} from "../../../components/router-link";
import {paths} from "../../../paths";

const Page = () => {
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState({})
    const [fileError, setFileError] = useState('')
    const [xmlNodes, setXmlNodes] = useState({})
    const [xPaths, setXPaths] = useState([])
    const [xmlContent, setXmlContent] = useState('')

    const SECTION_TITLE = 'Fields And Nodes'

    useEffect(() => {
        testDataSuitesApi.getItems({})
            .then(res => {
                res.items.forEach(e =>
                    testDataSuitesApi.getFileResources(e._id)
                        .then(resource => setFiles(files => ([...files, ...resource.items]))))
                    .catch(err => console.error(err))
            })
            .catch(err => console.error((err)))

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
        formik.setFieldValue('absolute_xpath', value)
    }


    const initialValues = {
        id: '',
        label: '',
        absolute_xpath: '',
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
            absolute_xpath: Yup
                .string()
                .max(255)
                .required('XPath is required'),
            relative_xpath: Yup
                .string()
                .required('Parent Node is required')

        }),
        onSubmit: (values, helpers) => {
            const toastId = toastLoad("Creating Element...")
            helpers.setSubmitting(true);

            const {id, label, parent_node, absolute_xpath, relative_xpath} = values
            fieldsRegistry.addElement({id, label, parent_node_id: parent_node.id, absolute_xpath, relative_xpath})
                .then(res => {
                    toastSuccess("Element Created", toastId);
                    helpers.setStatus({success: true});
                })
                .catch(err => {
                    toastError(err, toastId)
                    helpers.setStatus({success: false});
                })

                .finally(() => helpers.setSubmitting(false))
        }
    });

    const parentNodeSelect = xPaths.map(e => ({
        id: e.id,
        label: `${e.parent_node_id} : ${e.relative_xpath}`,
        absolute_xpath: e.absolute_xpath,
        parent_node: e.parent_node_id,
        relative_xpath: e.relative_xpath
    }))

    const handleClear = () => {
        formik.setValues(initialValues)
    }

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
            >
                <Stack spacing={1}>
                    <Typography variant="h4">
                        {SECTION_TITLE}
                    </Typography>
                    <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                        <Link
                            color="text.primary"
                            component={RouterLink}
                            href={paths.index}
                            variant="subtitle2"
                        >
                            App
                        </Link>
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            {SECTION_TITLE}
                        </Typography>
                    </Breadcrumbs>
                </Stack>
            </Stack>
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
                                                xPath={formik.values.absolute_xpath}
                                                relativeXPath={formik.values.relative_xpath}
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
                                        disabled={formik.isSubmitting}
                                        name="id"
                                        label="Id"
                                        required/>
                                    <FormTextField
                                        formik={formik}
                                        disabled={formik.isSubmitting}
                                        name="label"
                                        label="Label"
                                        required/>
                                    <FormTextField
                                        formik={formik}
                                        disabled={formik.isSubmitting}
                                        multiline
                                        name="absolute_xpath"
                                        label="Absolute xPath"
                                        required/>
                                    <Autocomplete
                                        id="parent_node"
                                        disabled={formik.isSubmitting}
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
                                                {option.absolute_xpath}
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
                                                         absolute_xpath={formik.values.absolute_xpath}
                                                         xpath={formik.values?.parent_node?.absolute_xpath}/>
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid sx={{justifyContent: 'center'}}>
                            <Button type='submit'
                                    disabled={!!fileError || !xmlContent || formik.isSubmitting}>Save</Button>
                            <Button onClick={handleClear} disabled={formik.isSubmitting}>Clear</Button>
                        </Grid>
                    </Grid>
                </Card>
            </form>
        </>
    )
}


Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
