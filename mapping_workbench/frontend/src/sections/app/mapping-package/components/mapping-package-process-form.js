import {useState} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import PropTypes from 'prop-types';
import {saveAs} from 'file-saver';

import Box from '@mui/system/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';

import {sessionApi} from '../../../../api/session';
import {toastError, toastLoad, toastSuccess} from '../../../../components/app-toast';

export const MappingPackageProcessForm = ({items, sectionApi, showExport}) => {

    const [isProcessing, setIsProcessing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const formik = useFormik({
        initialValues: {
            use_only_package_state: false,
            transform_test_data: true,
            generate_cm_assertions: true,
            validate_package: true,
            validate_package_xpath_sparql: true,
            validate_package_shacl: true
        },
        validationSchema: Yup.object({}),
        onSubmit: async (values, helpers) => {
            setIsProcessing(true)
            const tasks_to_run = [];
            if (values['transform_test_data']) {
                tasks_to_run.push('transform_test_data');
            }
            if (values['generate_cm_assertions']) {
                tasks_to_run.push('generate_cm_assertions');
            }
            if (values['validate_package']) {
                tasks_to_run.push('validate_package');

                if (values['validate_package_xpath_sparql']) {
                    tasks_to_run.push('validate_package_xpath');
                    tasks_to_run.push('validate_package_sparql');
                }
                if (values['validate_package_shacl']) {
                    tasks_to_run.push('validate_package_shacl');
                }
            }
            {
                console.log(items)
                items.forEach(item => {
                        const data = {
                            package_id: item._id,
                            project_id: sessionApi.getSessionProject(),
                            use_only_package_state: values['use_only_package_state']
                        }
                        if (tasks_to_run.length > 0) {
                            data.tasks_to_run = tasks_to_run.join(',');
                        }
                        const toastId = toastLoad(`Processing "${item.identifier}" ... This may take a while. Please, be patient.`)
                        sectionApi.processPackage(data)
                            .then(res => toastSuccess(`${res.task_name} successfully started.`, toastId))
                            .catch(err => toastError(err, toastId))
                            .finally(() => setIsProcessing(false))
                    }
                )
            }
        }
    });

    const processTasksEnabled = () => {
        return !formik.values.use_only_package_state;
    }

    const handleExport = item => {
        setIsExporting(true)
        const data = {
            package_id: item._id,
            project_id: sessionApi.getSessionProject()
        }
        const toastId = toastLoad(`Exporting "${item.identifier}" ... This may take a while. Please, be patient.`)
        sectionApi.exportPackage(data)
            .then(response => {
                saveAs(new Blob([response], {type: "application/x-zip-compressed"}), `${item.identifier}.zip`);
                toastSuccess(`"${item.identifier}" successfully exported.`, toastId)
            })
            .catch(err => toastError(err, toastId))
            .finally(() => setIsExporting(false))
    }

    return (<>
            <Card sx={{px: 3}}>
                <Alert severity="warning"
                       sx={{mt: 3, mx: 3}}>
                    {"Do not modify Project's Resources while the Mapping Package Processing task is initializing."}
                </Alert>
                {isProcessing && <Alert severity="warning"
                                        sx={{mt: 1, mx: 3}}>
                    <b>Mapping Package Processing task is initializing!</b>
                </Alert>}
                <form onSubmit={formik.handleSubmit}>
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
                            id='process_button'
                            disabled={isProcessing || isExporting}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {!isProcessing && "Process"}
                            {isProcessing && "Processing ..."}
                        </Button>
                        <Box>
                            <FormControlLabel
                                sx={{
                                    width: '100%',
                                }}
                                control={
                                    <Switch
                                        checked={formik.values.use_only_package_state}
                                        onChange={(event) => formik.setFieldValue('use_only_package_state', event.target.checked)}
                                    />
                                }
                                label="Use only the Package State"
                            />
                            <Divider sx={{my: 2}}/>
                            <b>Processing a Mapping Package includes:</b>
                            <ul style={{listStyleType: "none", padding: 0}}>
                                <li>
                                    <FormControlLabel
                                        sx={{
                                            width: '100%'
                                        }}
                                        control={
                                            <Switch
                                                disabled={!processTasksEnabled()}
                                                checked={processTasksEnabled() && formik.values.transform_test_data}
                                                onChange={(event) => formik.setFieldValue('transform_test_data', event.target.checked)}
                                            />
                                        }
                                        label="Transform Test Data"
                                    />
                                </li>
                                <li>
                                    <FormControlLabel
                                        sx={{
                                            width: '100%'
                                        }}
                                        control={
                                            <Switch
                                                disabled={!processTasksEnabled()}
                                                checked={processTasksEnabled() && formik.values.generate_cm_assertions}
                                                onChange={(event) => formik.setFieldValue('generate_cm_assertions', event.target.checked)}
                                            />
                                        }
                                        label="Generate CM Assertions Queries"
                                    />
                                </li>
                                <li>
                                    <FormControlLabel
                                        sx={{
                                            width: '100%'
                                        }}
                                        control={
                                            <Switch
                                                disabled={!processTasksEnabled()}
                                                checked={processTasksEnabled() && formik.values.validate_package}
                                                onChange={(event) => formik.setFieldValue('validate_package', event.target.checked)}
                                            />
                                        }
                                        label="Validate the Mapping Package"
                                    />
                                    <ul style={{listStyleType: "none"}}>
                                        <li>
                                            <FormControlLabel
                                                sx={{
                                                    width: '100%'
                                                }}
                                                control={
                                                    <Switch
                                                        checked={processTasksEnabled() && formik.values.validate_package_shacl && formik.values.validate_package}
                                                        disabled={!processTasksEnabled() || !formik.values.validate_package}
                                                        onChange={(event) => formik.setFieldValue('validate_package_shacl', event.target.checked)}
                                                    />
                                                }
                                                label="SHACL"
                                            />
                                        </li>
                                        <li>
                                            <FormControlLabel
                                                sx={{
                                                    width: '100%'
                                                }}
                                                control={
                                                    <Switch
                                                        checked={processTasksEnabled() && formik.values.validate_package_xpath_sparql && formik.values.validate_package}
                                                        disabled={!processTasksEnabled() || !formik.values.validate_package}
                                                        onChange={(event) => formik.setFieldValue('validate_package_xpath_sparql', event.target.checked)}
                                                    />
                                                }
                                                label="XPATH / SPARQL"
                                            />
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </Box>
                        {showExport &&
                            <Button
                                id='export_latest_button'
                                disabled={isProcessing || isExporting}
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={() => handleExport(items[0])}
                            >
                                {isExporting ? "Exporting Latest ..." : "Export Latest"}
                            </Button>}
                    </Stack>
                </form>
            </Card>
        </>
    )
}


MappingPackageProcessForm.propTypes = {
    item: PropTypes.array,
    sectionApi: PropTypes.object
}