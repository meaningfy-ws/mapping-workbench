import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";

import * as Yup from "yup";
import {useFormik} from "formik";
import AutocompleteCM from "./autocomplete";
import {sessionApi} from "src/api/session";
import {FormTextField} from "src/components/app/form/text-field";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import {useEffect} from "react";


const AddEditDrawer = ({open, onClose, item, sectionApi, structuralElements, afterItemSave, ontologyFragments}, load) => {


    const addItem = (requestValues, resetForm) => {
        const toastId = toastLoad('Adding item...')
        sectionApi.createItem(requestValues)
            .then(res => {
                toastSuccess('Added successfully', toastId)
                afterItemSave()
                onClose()
                resetForm({})
            })
            .catch(err => toastError(err, toastId))

    }

    const updateItem = (requestValues, resetForm) => {
        const toastId = toastLoad('Updating item...')
        requestValues['id'] = item._id;
        sectionApi.updateItem(requestValues)
            .then(res => {
                toastSuccess('Updated successfully', toastId)
                afterItemSave()
                onClose()
                resetForm({})
            })
            .catch(err => toastError(err, toastId))
    }

    const formik = useFormik({
        initialValues: {
            source_structural_element: item?.source_structural_element?.id ?? '',
            //'xpath_condition': item?.xpath_condition || '',
            'min_sdk_version': item?.min_sdk_version || '',
            'max_sdk_version': item?.max_sdk_version || '',
            'target_class_path': item?.target_class_path || '',
            'target_property_path': item?.target_property_path || '',
            'autocomplete_cm': [],
            'autocomplete_cm_checked': false,
        },
        validationSchema: Yup.object({
            source_structural_element: Yup
                .string()
                .required('Structural Element is required'),
            target_class_path: Yup
                .string()
                .required('Class Path is required'),
            target_property_path: Yup
                .string()
                .required('Property Path is required')
        }),
        onSubmit: async (initialValues, {resetForm, setErrors, setTouched}) => {
            const {autocomplete_cm, autocomplete_cm_checked, ...values } = initialValues
            values['project'] = sessionApi.getSessionProject();
            values['source_structural_element'] = values['source_structural_element'] || null;

            if (item) {
                updateItem(values, resetForm)
            } else {
                addItem(values, resetForm)
            }

        },
        enableReinitialize: true
    })


    useEffect(() => {
        const autocompleteValue = formik.values.autocomplete_cm
        if(formik.values.autocomplete_cm_checked) {
            const cmProperties = autocompleteValue.filter(e => e.type === 'PROPERTY').map(e => e.value).join(' / ')

            formik.setFieldValue('target_class_path',
                autocompleteValue.filter(e => ['DATA_TYPE','CLASS'].includes(e.type)).map(e => e.value).join(' / '))
            formik.setFieldValue('target_property_path', cmProperties.length ? `?this ${cmProperties} ?value` : '')
        }
    }, [formik.values.autocomplete_cm]);

    const handleAutocompleteChange = (type, value) => {
        const autocompleteValue = type === 'classOrList'
            ? [...formik.values.autocomplete_cm, {type: value.type, value: value.title}]
            : [...formik.values.autocomplete_cm, {type, value}]

        formik.setFieldValue('autocomplete_cm', autocompleteValue)

        const cmProperties = autocompleteValue.filter(e => e.type === 'property').map(e => e.value).join(' / ')

        formik.setFieldValue('target_class_path', autocompleteValue.filter(e => e.type !== 'property').map(e => e.value).join(' / '))
        formik.setFieldValue('target_property_path', cmProperties.length ? `?this ${cmProperties} ?value` : '')
    }

    const structuralElement = structuralElements.find(el => el.id === item?.source_structural_element?.id)
    const handleSourceStructuralElementSelect = ((e, value) => {
        formik.setFieldValue('source_structural_element', value?.id);
    })

    if (structuralElements === undefined) {
        return;
    }



    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={onClose}>
            <form onSubmit={formik.handleSubmit}>

                <Card sx={{width: 600}}>
                    <CardHeader title={item ? 'Edit Item' : 'Create Item'}/>
                    <CardContent>
                        <Stack direction='column'
                               gap={3}>
                            <FormControl sx={{ width: '100%'}}>
                                <Autocomplete
                                    fullWidth
                                    options={structuralElements}
                                    defaultValue={structuralElement}
                                    onChange={handleSourceStructuralElementSelect}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                                   label="Structural Element"
                                                   error={!!(formik.touched.source_structural_element && formik.errors.source_structural_element)}
                                                   helperText={formik.touched.source_structural_element && formik.errors.source_structural_element}
                                        />}
                                />
                            </FormControl>
                            <FormTextField formik={formik}
                                           disabled={true}
                                           name="xpath_condition"
                                           label="XPath Condition"/>
                            <FormTextField formik={formik}
                                           name="min_sdk_version"
                                           label="Min SDK"/>
                            <FormTextField formik={formik}
                                           name="max_sdk_version"
                                           label="Max SDK"/>
                            <FormTextField formik={formik}
                                           error={!!(formik.touched.target_class_path && formik.errors.target_class_path)}
                                           fullWidth
                                           helperText={formik.touched.target_class_path && formik.errors.target_class_path}
                                           disabled={formik.values.autocomplete_cm_checked}
                                           name="target_class_path"
                                           label="Ontology Class Path"/>
                            <FormTextField formik={formik}
                                           error={!!(formik.touched.target_property_path && formik.errors.target_property_path)}
                                           fullWidth
                                           helperText={formik.touched.target_property_path && formik.errors.target_property_path}
                                           disabled={formik.values.autocomplete_cm_checked}
                                           name="target_property_path"
                                           label="Ontology Property Path"/>
                            <Stack>
                                <FormControlLabel
                                    sx={{width: '100%'}}
                                    control={
                                        <Checkbox
                                            checked={formik.values.autocomplete_cm_checked}
                                            onChange={() => formik.setFieldValue('autocomplete_cm_checked', event.target.checked)}
                                        />
                                    }
                                    label="Use Autocompelete"
                                    value=""
                                />
                                <AutocompleteCM formik={formik}
                                                disabled={!formik.values.autocomplete_cm_checked}
                                                data={ontologyFragments}
                                                onSelect={handleAutocompleteChange}
                                                required={formik.values.autocomplete_cm_checked}
                                                name='autocomplete_cm'/>
                            </Stack>
                        </Stack>
                    </CardContent>
                    <Button type='submit'
                            sx={{width: '100%'}}
                            disabled={false}>Save</Button>
                </Card>

            </form>
        </Drawer>
    )
}

export default AddEditDrawer