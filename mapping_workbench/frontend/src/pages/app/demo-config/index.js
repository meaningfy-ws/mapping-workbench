import {useEffect, useState} from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {securityApi} from "../../../api/security";
import {useRouter} from "next/router";
import {useAuth} from "../../../hooks/use-auth";
import {paths} from "../../../paths";
import Button from "@mui/material/Button";
import ResetDemoIcon from "@mui/icons-material/RestartAlt";
import Paper from "@mui/material/Paper";
import {demoConfigApi} from "../../../api/demo-config";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import {tasksApi} from "../../../api/tasks";


const Page = () => {

    const auth = useAuth();
    const router = useRouter();
    const [isRunning, setIsRunning] = useState(false);
    const handleDemoReset = () => {
        setIsRunning(true);
        const toastId = toastLoad(`Resetting demo data ... `)

        demoConfigApi.reset()
            .then((res) => {
                toastSuccess(`Demo data successfully reset.`, toastId);
                router.reload();
            })
            .catch(err => toastError(`"Demo data reset failed: ${err.message}.`, toastId))
            .finally(() => setIsRunning(false))
    }

    useEffect(
        () => {
            if (!securityApi.isUserAdmin(auth?.user)) {
                router.replace(paths.notFound);
            }
        }, []);

    usePageView();

    return (
        <>
            <Seo title="Demo Config"/>

            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">Demo Config</Typography>
                    </Stack>
                </Stack>
                <Card>
                    <Paper sx={{p: 2}}>
                        <Button variant='contained'
                                color="warning"
                                onClick={handleDemoReset}
                                disabled={isRunning}
                                startIcon={<ResetDemoIcon/>}>
                            Reset Demo Data
                        </Button>

                    </Paper>
                </Card>
            </Stack>
        </>
    );
};

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Page;
