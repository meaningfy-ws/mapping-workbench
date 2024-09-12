import {useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/router";

import Stack from '@mui/material/Stack';
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import {usePageView} from 'src/hooks/use-page-view';
import {FormTextField} from "src/components/app/form/text-field";
import {Layout as AppLayout} from 'src/layouts/app';
import {fieldsRegistryApi as sectionApi} from 'src/api/fields-registry';
import {sessionApi} from "../../../../api/session";
import {paths} from "../../../../paths";
import {toastError, toastLoad, toastSuccess} from "../../../../components/app-toast";


const Page = () => {
    usePageView();
    const router = useRouter()

    const [isRunning, setIsRunning] = useState(false);

    const formik = useFormik({
        initialValues: {
            github_repository_url: "",
            branch_or_tag_name: ""
        },
        validationSchema: Yup.object({
            github_repository_url: Yup
                .string()
                .max(1024)
                .required('GitHub Repo URL is required'),
            branch_or_tag_name: Yup
                .string()
                .max(20)
                .required('Branch or Tag name is required')
        }),
        onSubmit: async (values, helpers) => {
            setIsRunning(true)
            values['project_id'] = sessionApi.getSessionProject();
            const toastId = toastLoad(`Importing eForm Fields ... `)
            sectionApi.importEFormsFromGithub(values)
                .then((res) => {
                    helpers.setStatus({success: true});
                    toastSuccess(`${res.task_name} successfully started.`, toastId)
                    router.push({
                        pathname: paths.app[sectionApi.section].elements.index
                    })
                })
                .catch(err => {
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    toastError(`eForm Fields import failed: ${err.message}.`, toastId);
                })
                .finally(setIsRunning(false))
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card>
                <CardHeader title="Import eForms XSD from GitHub"/>
                <CardContent sx={{pt: 0}}>
                    <Grid container
                          spacing={3}>
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="github_repository_url"
                                           label="GitHub Repository URL"
                                           required/>
                        </Grid>
                        <Grid xs={12}
                              md={12}>
                            <FormTextField formik={formik}
                                           name="branch_or_tag_name"
                                           label="Branch or Tag name"
                                           required/>
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
                        id='import'
                        disabled={isRunning}
                        type="submit"
                        variant="contained"
                    >
                        Import
                    </Button>
                </Stack>
            </Card>
        </form>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
