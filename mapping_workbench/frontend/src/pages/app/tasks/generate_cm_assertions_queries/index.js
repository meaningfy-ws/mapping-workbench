import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {Play as RunIcon} from "@untitled-ui/icons-react/build/esm";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {BreadcrumbsSeparator} from "/src/components/breadcrumbs-separator";
import {useTranslation} from "react-i18next";
import {tokens} from "/src/locales/tokens";
import {useCallback, useState} from "react";
import nProgress from "nprogress";
import {tasksApi} from "/src/api/tasks";
import toast from "react-hot-toast";
import TaskIcon from "@mui/icons-material/TaskAlt";
import Divider from "@mui/material/Divider";
import RadioGroup from "@mui/material/RadioGroup";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {sessionApi} from "../../../../api/session";
import {useFormik} from "formik";
import Checkbox from "@mui/material/Checkbox";
import {toastError, toastLoad, toastSuccess} from "../../../../components/app-toast";


const Page = () => {
    usePageView();

    const sessionProject = sessionApi.getSessionProject();

    const [isRunning, setIsRunning] = useState(false);

    const {t} = useTranslation();
    const taskTitle = t(tokens.nav.generate_cm_assertions_queries);

    const formik = useFormik({
        initialValues: {
            project: sessionProject,
            cleanup: false
        },
        onSubmit: async (values, helpers) => {
        }
    });

    const handleTask = useCallback(() => {
        setIsRunning(true);
        nProgress.start();
        let request = {
            'filters': {}
        }
        if (formik.values['project']) {
            request['filters']['project'] = formik.values['project'];
        }
        if (formik.values['cleanup']) {
            request['filters']['cleanup'] = formik.values['cleanup'];
        }

        const toastId = toastLoad(`Running "${taskTitle}" task ... `)
        tasksApi.runGenerateCMAssertionsQueries(request)
            .then(() => toastSuccess(`"${taskTitle}" successfully finished.`, toastId))
            .catch(err => toastError(`"${taskTitle}" failed: ${err.message}.`, toastId))
            .finally(() => setIsRunning(false))
        nProgress.done();
    }, [formik]);

    const handleFilterProjectChange = useCallback((event) => {
        formik.setFieldValue('project', event.target.value);
    }, [formik]);

    const handleCleanupChange = useCallback((event) => {
        formik.setFieldValue('cleanup', event.target.checked);
    }, [formik]);

    return (
        <>
            <Seo title={`App: ${tasksApi.TASK_TITLE} ${taskTitle}`}/>
            <Stack spacing={4}>
                <Stack spacing={1}>
                    <Typography variant="h4">
                        {tasksApi.TASKS_TITLE}
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
                        <Typography
                            color="text.primary"
                            variant="subtitle2"
                        >
                            {tasksApi.TASKS_TITLE}
                        </Typography>
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
                component={RadioGroup}
                defaultValue={sessionProject}
                name="filter_project"
                spacing={3}
                onChange={handleFilterProjectChange}
                sx={{
                    pt: 4
                }}
            >
                <Paper
                    key="2"
                    sx={{
                        alignItems: 'flex-start',
                        display: 'flex',
                        p: 2
                    }}
                    variant="outlined"
                    square={true}
                >
                    <Box sx={{mr: 2, mt: 1}}>
                        <b>For</b>
                    </Box>
                    <FormControlLabel
                        control={<Radio/>}
                        key="project_current"
                        label={(
                            <Box sx={{ml: 0, mr: 0}}>
                                <Typography
                                    variant="subtitle2"
                                >
                                    Current
                                </Typography>
                            </Box>
                        )}
                        value={sessionProject}
                    />
                    <Box sx={{ml: 0, mt: 1}}>
                        <b>Project</b>
                    </Box>
                </Paper>
            </Stack>
            <Paper
                sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    px: 2,
                    mt: 0
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
