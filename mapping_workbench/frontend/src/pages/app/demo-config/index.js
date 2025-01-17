import {useEffect} from 'react';

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


const Page = () => {

    const auth = useAuth();
    const router = useRouter();

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
                                onClick={() => demoConfigApi.reset()}
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
