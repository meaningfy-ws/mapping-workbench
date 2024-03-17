import {useState} from "react";
import toast from "react-hot-toast";
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

            toast.promise(sectionApi.importEFormsFromGithub(values), {
                loading: `Importing eForm Fields ... `,
                success: (response) => {
                    setIsRunning(false);
                    helpers.setStatus({success: true});
                    return `eForm Fields successfully imported.`;
                },
                error: (err) => {
                    setIsRunning(false);
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    return `eForm Fields import failed: ${err.message}.`;
                }
            }).then(r => {
                router.push({
                    pathname: paths.app[sectionApi.section].elements.index
                })
            })
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card>
                <CardHeader title="Import eForms SDK from GitHub"/>
                <CardContent sx={{pt: 0}}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="github_repository_url" label="GitHub Repository URL"
                                           required={true}/>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <FormTextField formik={formik} name="branch_or_tag_name" label="Branch or Tag name"
                                           required={true}/>
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
