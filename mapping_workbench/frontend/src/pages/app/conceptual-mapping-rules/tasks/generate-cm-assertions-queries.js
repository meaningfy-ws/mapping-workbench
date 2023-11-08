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
import {conceptualMappingRulesApi as sectionApi} from "/src/api/conceptual-mapping-rules";
import toast from "react-hot-toast";
import RefreshIcon from '@untitled-ui/icons-react/build/esm/Repeat02';
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useFormik} from "formik";
import Checkbox from "@mui/material/Checkbox";


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

    const handleTask = useCallback(() => {
        setIsRunning(true);
        nProgress.start();
        let request = {
            'filters': {}
        }

        if (formik.values['cleanup']) {
            request['filters']['cleanup'] = formik.values['cleanup'];
        }

        toast.promise(sectionApi.generateCMAssertionsQueries(request), {
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
