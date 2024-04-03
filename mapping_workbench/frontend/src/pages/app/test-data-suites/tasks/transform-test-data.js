import {useState} from "react";
import {useTranslation} from "react-i18next";
import nProgress from "nprogress";
import {useFormik} from "formik";

import {Play as RunIcon} from "@untitled-ui/icons-react/build/esm";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import TaskIcon from "@mui/icons-material/TaskAlt";
import Divider from "@mui/material/Divider";

import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {BreadcrumbsSeparator} from "/src/components/breadcrumbs-separator";
import {tokens} from "/src/locales/tokens";
import {testDataSuitesApi as sectionApi} from "/src/api/test-data-suites";
import {toastError, toastLoad, toastSuccess} from "../../../../components/app-toast";


const Page = () => {
    usePageView();

    const [isRunning, setIsRunning] = useState(false);

    const {t} = useTranslation();
    const taskTitle = t(tokens.nav.transform_test_data);

    const handleTask = () => {
        setIsRunning(true);
        nProgress.start();
        let request = {
            'filters': {}
        }

        const toastId = toastLoad(`Running "${taskTitle}" task ... `)
        sectionApi.transformTestData(request)
            .then(() => toastSuccess(`"${taskTitle}" successfully finished.`, toastId))
            .catch(err => toastError(`"${taskTitle}" failed: ${err.message}.`, toastId))
            .finally(() => setIsRunning(false))

        nProgress.done();
    }

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
                        <SvgIcon fontSize="small"><TaskIcon/></SvgIcon> {taskTitle}
                    </Typography>
                </Stack>
            </Stack>
            <Stack
                alignItems="center"
                direction="row"
                pt={4}
            >
                <Button
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
