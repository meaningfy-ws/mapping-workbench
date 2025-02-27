import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import * as Yup from "yup";
import {useFormik} from "formik";
import {parseString} from "xml2js";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import {Seo} from "src/components/seo";
import {sessionApi} from "src/api/session";
import {Layout as AppLayout} from 'src/layouts/app';
import File from 'src/sections/app/fields-and-nodes/file'
import {FormTextField} from "src/components/app/form/text-field";
import {executeXPaths} from "src/sections/app/fields-and-nodes/utils";
import {ElementsDefinitionTabs} from 'src/sections/app/elements-definition';
import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import XpathEvaluator from "src/sections/app/fields-and-nodes/xpath-evaluator";
import RelativeXpathFinder from "src/sections/app/fields-and-nodes/relative-xpath-finder";
import {genericTripleMapFragmentsApi as tripleMapFragments} from "src/api/triple-map-fragments/generic";
import {NavigationTabsWrapper} from 'src/components/navigation-tabs-wrapper'

const SECTION_TITLE = 'Fields Develop'

const Page = () => {
    const router = useRouter()

    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState('')
    const [fileError, setFileError] = useState('')
    const [xmlNodes, setXmlNodes] = useState({})
    const [xPaths, setXPaths] = useState([])
    const [xmlContent, setXmlContent] = useState('')
    const [fileContent, setFileContent] = useState()

    const {id} = router.query

    useEffect(() => {
        const project = sessionApi.getSessionProject()
        if(id) {
            tripleMapFragments.getTripleMapFragmentTree({project})
                .then(res => {
                    setFiles(res.test_data_suites)
                    console.log(res.test_data_suites.map(suite => suite.test_datas.map(data => data.test_data_id)).flat(),id)
                    if (res.test_data_suites.map(suite => suite.test_datas.map(data => data.test_data_id)).flat().includes(id))
                        setSelectedFile(id)
                })
                .catch(err => console.error(err))

            fieldsRegistry.getXpathsList()
                .then(res => setXPaths(res))
                .catch(err => console.error(err))
        }
    }, [id])

    useEffect(() => {
            // Parse the XML string into a DOM Document
            setFileError('')
            setXmlNodes('')
            if (selectedFile) {
                tripleMapFragments.getTripleMapXmlContent(selectedFile)
                    .then(res => {
                        setFileContent(res.content)
                        try {
                            parseString(res.content, {explicitArray: false}, (err, result) => {
                                if (err) {
                                    console.error('Error parsing XML:', err);
                                    setFileError(err)
                                } else {
                                    setXmlNodes(result)
                                }
                            });
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(res.content, "application/xml");
                            setXmlContent(xmlDoc)

                        } catch (err) {
                            setXmlContent('')
                            setFileError(err)
                        }
                    })

            }
        },
        [selectedFile]
    )

    const onChangeXPath = (value) => {
        value.shift()
        formik.setFieldValue('parent_node', '')
        formik.setFieldValue('relative_xpath', '')
        formik.setFieldValue('absolute_xpath', ['/*', ...value].join('/'))
    }

    const handleClear = () => formik.setValues(initialValues)

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

    const parentNodeSelect = xmlContent && xPaths ? executeXPaths(xmlContent, xPaths)
        .filter(e => !["", "/*"].includes(e.resolved_xpath) && formik.values.absolute_xpath.includes(e.resolved_xpath))
        .map(e => ({...e, label: e.absolute_xpath})) : [];

    return (
        <>
            <Seo title={`App: ${SECTION_TITLE} List`}/>
            <NavigationTabsWrapper>
                <ElementsDefinitionTabs/>
            </NavigationTabsWrapper>
            <Stack spacing={4}
                   mt={5}>
                <form onSubmit={formik.handleSubmit}>
                    <Card sx={{p: 2}}>
                        <Grid container
                              justifyContent='center'>
                            <Grid container
                                  spacing={2}>
                                <Grid item
                                      xs={12}
                                      xl={6}>
                                    <Stack gap={2}>
                                        <TextField
                                            fullWidth
                                            label="Select File"
                                            onChange={e => setSelectedFile(e.target.value)}
                                            select
                                            value={selectedFile}
                                        >
                                            {files.map(suite =>
                                                [<MenuItem key={suite.suite_id}
                                                           value={suite.suite_id}
                                                           disabled>{suite.suite_title}

                                                </MenuItem>,
                                                    suite.test_datas.map(testData =>
                                                        <MenuItem key={testData.test_data_id}
                                                                  value={testData.test_data_id}
                                                                  style={{paddingLeft: 40}}>
                                                            {testData.test_data_title}
                                                        </MenuItem>)])
                                            }
                                        </TextField>
                                        {fileError
                                            ? <Alert severity="error">{fileError.message}</Alert>
                                            : <File xmlContent={xmlContent}
                                                    xmlNodes={xmlNodes}
                                                    xPaths={xPaths}
                                                    xPath={formik.values.absolute_xpath}
                                                    relativeXPath={formik.values.relative_xpath}
                                                    error={fileError}
                                                    fileContent={fileContent}
                                                    handleClick={onChangeXPath}/>
                                        }
                                    </Stack>
                                </Grid>
                                <Grid item
                                      xs={12}
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
                                            disabled={formik.isSubmitting || !formik.values.absolute_xpath}
                                            error={formik.touched['parent_node'] && formik.errors['parent_node']}
                                            isOptionEqualToValue={(option, value) => option.absolute_xpath === value}
                                            onBlur={formik.handleBlur}
                                            defaultValue={''}
                                            onChange={(e, value) => formik.setFieldValue('parent_node', value)}
                                            value={formik.values?.parent_node?.absolute_xpath ?? ''}
                                            options={parentNodeSelect}
                                            renderOption={(props, option, {inputValue}) => {
                                                const {key, ...optionProps} = props;
                                                const matches = match(option.absolute_xpath, inputValue, {insideWords: true});
                                                const parts = parse(option.absolute_xpath, matches);
                                                return (
                                                    <li key={key}
                                                        {...optionProps}>
                                                        <div>
                                                            {parts.map((part, index) => (
                                                                <span key={index}
                                                                      style={{
                                                                          fontWeight: part.highlight ? 700 : 400,
                                                                      }}
                                                                >
                                                                        {part.text}
                                                                    </span>
                                                            ))}
                                                        </div>
                                                    </li>)
                                            }}
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                           label="Parent Node"/>
                                            }
                                        />
                                        <RelativeXpathFinder formik={formik}
                                                             error={fileError}
                                                             xmlContent={xmlContent}
                                                             absolute_xpath={formik.values.absolute_xpath}
                                                             xpath={formik.values?.parent_node?.absolute_xpath}/>
                                        <XpathEvaluator xmlDoc={xmlContent}
                                                        xpath={formik.values?.parent_node?.absolute_xpath}
                                                        absolute_xpath={formik.values.absolute_xpath}/>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Stack direction='row'
                                   sx={{mt: 2}}>
                                <Button type='submit'
                                        disabled={!!fileError || !xmlContent || formik.isSubmitting}>Save</Button>
                                <Button onClick={handleClear}
                                        disabled={formik.isSubmitting}>Clear</Button>
                            </Stack>
                        </Grid>

                    </Card>
                </form>
            </Stack>
        </>
    )
}


Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
