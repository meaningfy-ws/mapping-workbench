import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {FormTextField} from "../../../components/app/form/text-field";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import {useFormik} from "formik";
import * as Yup from "yup";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";

const AddEditDrawer = ({open, onClose, item}, load) => {

    const addItem = (id, type, description) => {
        setState(e=> ({ ...e, load: true }))
        const toastId = toastLoad('Adding item...')
        postTransaction(id, type, description).send()
            .then(res => {
                toastSuccess('Added successfully', toastId)
                getItems()
                setState(e=>({ ...e, drawerOpen: false, load: false }))
            })
            .catch(err => toastError(err, toastId))
    }

    const updateItem = (oldId, id, type, description) => {
        setState(e=>({ ...e, load: true }))
        const toastId = toastLoad('Updating item...')
        deleteTransaction(oldId).send()
            .then(res => {
                postTransaction(id, type, description).send()
                    .then(res => {
                        setState(e=>({ ...e, drawerOpen: false, load: false }))
                        getItems()
                        toastSuccess('Updated successfully',toastId)
                    })
                }
            )
            .catch(err => toastError(err, toastId))
    }

    console.log(item)

    const formik = useFormik({
        initialValues: {
            'field_id': item?.field_id || '',
            'field_label': item?.field_label || '',
            'absolute_xpath': item?.absolute_xpath || '',
            'xpath_condition': item?.xpath_condition || '',
            'ontology_class_path': item?.ontology_class_path || '',
            'ontology_property_path': item?.ontology_property_path || '',
        },
        validationSchema: Yup.object({
            "@id": Yup
                .string()
                .max(255)
                .required('@Id is required'),
            "@type": Yup.string().max(255).required('Type is required')
        }),
        onSubmit: (values, helpers) => {
            if(item)
                updateItem(state.item['@id'], values['@id'], values['@type'], values['schema:description'])
            else addItem(values['@id'],values['@type'], values['schema:description'])
        },
        enableReinitialize: true
    })


    return(
        <Drawer
            anchor='right'
            open={open}
            onClose={onClose}>
            <form onSubmit={formik.handleSubmit}
            >

                <Card sx={{width: 400}}>
                        <CardHeader title={item ? 'Edit Item' : 'Create Item'}/>
                    <CardContent>
                        <Stack direction='column'
                               gap={3}>
                            <Typography></Typography>
                            <FormTextField formik={formik}
                                           name="field_id"
                                           label="Field Id"/>
                            <FormTextField formik={formik}
                                           name="field_label"
                                           label="Field Lable"/>
                            <FormTextField formik={formik}
                                           name="absolute_xpath"
                                           label="Absolute XPath"/>
                            <FormTextField formik={formik}
                                           name="xpath_condition"
                                           label="XPath Condition"/>
                            <FormTextField formik={formik}
                                           name="ontology_class_path"
                                           label="Ontology Class Path"/>
                            <FormTextField formik={formik}
                                           name="ontology_property_path"
                                           label="Ontology Property Path"/>
                        </Stack>
                    </CardContent>
                    <Button type='submit'
                            sx={{width: '100%'}}
                            disabled={load}>Save</Button>
                </Card>

            </form>
        </Drawer>
    )
}

export default AddEditDrawer