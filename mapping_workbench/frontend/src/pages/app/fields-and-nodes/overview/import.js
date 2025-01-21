import {useState} from "react";
import {useFormik} from "formik";
import {useRouter} from "next/router";
import * as Yup from "yup";

import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Stack from '@mui/material/Stack';
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";

import {paths} from "src/paths";
import {sessionApi} from "src/api/session";
import {Layout as AppLayout} from 'src/layouts/app';
import {usePageView} from 'src/hooks/use-page-view';
import {RouterLink} from "src/components/router-link";
import {FormTextField} from "src/components/app/form/text-field";
import {fieldsOverviewApi as sectionApi} from 'src/api/fields-overview';
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";


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
                .max(1024),
            branch_or_tag_name: Yup
                .string()
                .required('Branch or Tag name is required')
        }),
        onSubmit: async (values, helpers) => {
            setIsRunning(true)
            values['project_id'] = sessionApi.getSessionProject();
            const toastId = toastLoad(`Importing eForm Fields ... `)
            sectionApi.importEFormsXSD(values)
                .then((res) => {
                    helpers.setStatus({success: true});
                    toastSuccess(`${res.task_name} successfully started.`, toastId)
                    // router.push({
                    //     pathname: paths.app.fields_and_nodes.overview.index
                    // })
                })
                .catch(err => {
                    console.log(err)
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    toastError(`eForm Fields import failed: ${err.message}.`, toastId);
                })
                .finally(setIsRunning(false))
        }
    });

    return (
        <Stack spacing={4}>
            <div>
                <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.app.fields_and_nodes.overview.index}
                    sx={{
                        alignItems: 'center',
                        display: 'inline-flex'
                    }}
                    underline="hover"
                >
                    <SvgIcon sx={{mr: 1}}>
                        <ArrowLeftIcon/>
                    </SvgIcon>
                    <Typography variant="subtitle2">
                        {sectionApi.SECTION_TITLE}
                    </Typography>
                </Link>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <Card>
                    <CardHeader title="Import eForms XSD"/>
                    <CardContent sx={{pt: 0}}>
                        <Grid container
                              spacing={3}>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="branch_or_tag_name"
                                               label="Version(s)"
                                               helperText="separated by comma (,)"
                                               required/>
                            </Grid>
                            <Grid xs={12}
                                  md={12}>
                                <FormTextField formik={formik}
                                               name="github_repository_url"
                                               label="GitHub Repository URL"
                                />
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
        </Stack>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
