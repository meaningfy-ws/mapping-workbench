import {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {useFormik} from "formik";

import RefreshIcon from '@untitled-ui/icons-react/build/esm/Repeat02';
import {Play as RunIcon} from "@untitled-ui/icons-react/build/esm";
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import {BreadcrumbsSeparator} from "/src/components/breadcrumbs-separator";
import {tokens} from "/src/locales/tokens";
import nProgress from "nprogress";
import {conceptualMappingRulesApi as sectionApi} from "/src/api/conceptual-mapping-rules";
import {toastError, toastLoad, toastSuccess} from "../../../../components/app-toast";
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';


const Page = () => {
    usePageView();

    const [isRunning, setIsRunning] = useState(false);
    const {t} = useTranslation();
    const taskTitle = t(tokens.nav.generate_cm_assertions_queries);

    const formik = useFormik({
        initialValues: {
            cleanup: false
        },
        onSubmit: async (values, helpers) => {
        }
    });

    const handleTask = () => {
        setIsRunning(true);
        nProgress.start();
        let request = {
            'filters': {}
        }

        if (formik.values['cleanup']) {
            request['filters']['cleanup'] = formik.values['cleanup'];
        }

        const toastId = toastLoad(`Running "${taskTitle}" task ... `)
        sectionApi.generateCMAssertionsQueries(request)
            .then(res => toastSuccess(`${res.task_name} successfully started.`, toastId))
            .catch(err => toastError(`"${taskTitle}" failed: ${err.message}.`, toastId))
            .finally(() => setIsRunning(false))
        nProgress.done();
    }

    const handleCleanupChange = useCallback((event) => {
        formik.setFieldValue('cleanup', event.target.checked);
    }, [formik]);

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} ${taskTitle}`}/>
            <Stack spacing={4}>
                <Stack spacing={1}>
                    <Typography variant="h4">
                        {sectionApi.SECTION_TITLE}
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
                        <Link
                            color="text.primary"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].index}
                            variant="subtitle2"
                        >
                            {sectionApi.SECTION_TITLE}
                        </Link>
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            {taskTitle}
                        </Typography>
                    </Breadcrumbs>
                    <Divider/>
                    <Typography
                        color="text.primary"
                        variant="h5"
                        sx={{
                            pt: 2
                        }}
                    >
                        <SvgIcon fontSize="small"><RefreshIcon/></SvgIcon> {taskTitle}
                    </Typography>
                </Stack>
            </Stack>
            <Paper
                sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    px: 2,
                    mt: 4
                }}
                variant="outlined"
                square={true}
            >
                <FormControlLabel
                    sx={{
                        width: '100%'
                    }}
                    control={
                        <Checkbox
                            checked={formik.values.cleanup}
                            onChange={handleCleanupChange}
                        />
                    }
                    label="Cleanup"
                    value=""
                />
            </Paper>
            <Stack
                alignItems="center"
                direction="row"
                pt={4}
            >
                <Button
                    id="run_button"
                    onClick={handleTask}
                    disabled={isRunning}
                    startIcon={(
                        <SvgIcon>
                            <RunIcon/>
                        </SvgIcon>
                    )}
                    variant="contained"
                >
                    Run
                </Button>
            </Stack>
        </>
    )
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
