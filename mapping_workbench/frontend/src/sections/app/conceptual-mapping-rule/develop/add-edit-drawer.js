import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";

import * as Yup from "yup";
import {useFormik} from "formik";
import AutocompleteCM from "./autocomplete";
import {sessionApi} from "../../../../api/session";
import {FormTextField} from "../../../../components/app/form/text-field";
import {toastLoad, toastSuccess} from "../../../../components/app-toast";


const AddEditDrawer = ({open, onClose, item, sectionApi, structuralElements, afterItemSave, propertyData}, load) => {


    const addItem = async (requestValues) => {
        const toastId = toastLoad('Adding item...')
        await sectionApi.createItem(requestValues);
        toastSuccess('Added successfully', toastId)
    }

    const updateItem = async (requestValues) => {
        const toastId = toastLoad('Updating item...')
        requestValues['id'] = item._id;
        await sectionApi.updateItem(requestValues);
        toastSuccess('Updated successfully', toastId)
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
        onSubmit: async (values, {resetForm, setErrors, setTouched}) => {
            values['project'] = sessionApi.getSessionProject();
            values['source_structural_element'] = values['source_structural_element'] || null;
            values['target_class_path'] = values['autocomplete_cm_checked'] ? cmPropertiesOut : values['target_class_path']
            values['target_property_path'] = values['autocomplete_cm_checked'] ? cmNonProperties : values['target_property_path']

            if (item) {
                item = await updateItem(values)
            } else {
                item = await addItem(values)
            }
            afterItemSave(item)
            onClose()
            resetForm({})
        },
        enableReinitialize: true
    })

    const structuralElement = structuralElements.find(el => el.id === item?.source_structural_element?.id)
    const handleSourceStructuralElementSelect = ((e, value) => {
        formik.setFieldValue('source_structural_element', value?.id);
    })

    if (structuralElements === undefined) {
        return;
    }

    const cmProperties = formik.values.autocomplete_cm.filter(e => e.type === 'property').map(e => e.value).join(' / ')
    const cmPropertiesOut = cmProperties.length ? `?this ${cmProperties} ?value` : ''
    const cmNonProperties = formik.values.autocomplete_cm.filter(e => e.type !== 'property').map(e => e.value).join(' / ')

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
                            <Typography></Typography>
                            <FormControl sx={{my: 2, width: '100%'}}>
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

                            {formik.values.autocomplete_cm_checked ?
                                <>
                                    <TextField disabled
                                               label="Ontology Class Path"
                                               value={cmNonProperties}/>
                                    <TextField disabled
                                               label="Ontology Property Path"
                                               value={cmPropertiesOut}/>
                                </>
                            :
                                <>
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
                                </>}
                            <FormControlLabel
                                sx={{
                                    width: '100%'
                                }}
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
                                            data={propertyData}
                                            name='autocomplete_cm'/>
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