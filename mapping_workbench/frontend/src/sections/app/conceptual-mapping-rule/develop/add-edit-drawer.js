import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {FormTextField} from "../../../../components/app/form/text-field";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import {useFormik} from "formik";
import * as Yup from "yup";
import {toastError, toastLoad, toastSuccess} from "../../../../components/app-toast";
import {sessionApi} from "../../../../api/session";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "./autocomplete";

const AddEditDrawer = ({open, onClose, item, sectionApi, structuralElements}, load) => {

    const addItem = async (requestValues) => {
        const toastId = toastLoad('Adding item...')
        await sectionApi.createItem(requestValues);
        toastSuccess('Added successfully',toastId)
    }

    const updateItem = async (requestValues) => {
        const toastId = toastLoad('Updating item...')
        requestValues['id'] = item._id;
        await sectionApi.updateItem(requestValues);
        toastSuccess('Updated successfully',toastId)
    }

    const handleSourceStructuralElementSelect = e => {
        const value = e.target.value;
        formik.setFieldValue('source_structural_element', value);
    }

    const formik = useFormik({
        initialValues: {
            source_structural_element: item?.source_structural_element?.id ?? '',
            //'xpath_condition': item?.xpath_condition || '',
            'min_sdk_version': item?.min_sdk_version || '',
            'max_sdk_version': item?.max_sdk_version || '',
            'target_class_path': item?.target_class_path || '',
            'target_property_path': item?.target_property_path || '',
        },
        validationSchema: Yup.object({

        }),
        onSubmit: async (values, helpers) => {
            values['project'] = sessionApi.getSessionProject();
            values['source_structural_element'] = values['source_structural_element'] || null;
            if(item) {
                await updateItem(values)
            } else {
                await addItem(values)
            }
        },
        enableReinitialize: true
    })


    return(
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
                                <TextField
                                    fullWidth
                                    label="Structural Element"
                                    onChange={handleSourceStructuralElementSelect}
                                    select
                                    value={formik.values.source_structural_element}
                                >
                                    <MenuItem value={null}>&nbsp;</MenuItem>
                                    {structuralElements.map((x) => (
                                        <MenuItem key={x.id}
                                                  value={x.id}>{x.sdk_element_id}</MenuItem>
                                    ))}
                                </TextField>
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
                                           name="target_class_path"
                                           label="Ontology Class Path"/>
                            <FormTextField formik={formik}
                                           name="target_property_path"
                                           label="Ontology Property Path"/>
                            <Autocomplete/>
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