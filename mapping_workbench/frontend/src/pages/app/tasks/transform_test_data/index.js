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


const Page = () => {
    usePageView();

    const sessionProject = sessionApi.getSessionProject();

    const [isRunning, setIsRunning] = useState(false);

    const {t} = useTranslation();
    const taskTitle = t(tokens.nav.transform_test_data);

    const formik = useFormik({
        initialValues: {
            project: sessionProject
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
        toast.promise(tasksApi.runTransformTestData(request), {
            loading: `Running "${taskTitle}" task ... `,
            success: (response) => {
                setIsRunning(false);
                return `"${taskTitle}" successfully finished.`;
            },
            error: (err) => {
                setIsRunning(false);
                return `"${taskTitle}" failed: ${err.message}.`;
            }
        }).then(r => {
        })
        nProgress.done();
    }, [formik]);

    const handleFilterProjectChange = useCallback((event) => {
        formik.setFieldValue('project', event.target.value);
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
