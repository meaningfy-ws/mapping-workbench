import {addDays, subDays, subHours, subMinutes} from 'date-fns';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {useSettings} from 'src/hooks/use-settings';
import {Layout as AppLayout} from 'src/layouts/app';
import {HomeApp} from "../../sections/home/home-app";
// import { OverviewBanner } from 'src/sections/dashboard/overview/overview-banner';
// import { OverviewDoneTasks } from 'src/sections/dashboard/overview/overview-done-tasks';
// import { OverviewEvents } from 'src/sections/dashboard/overview/overview-events';
// import { OverviewInbox } from 'src/sections/dashboard/overview/overview-inbox';
// import { OverviewTransactions } from 'src/sections/dashboard/overview/overview-transactions';
// import { OverviewPendingIssues } from 'src/sections/dashboard/overview/overview-pending-issues';
// import { OverviewSubscriptionUsage } from 'src/sections/dashboard/overview/overview-subscription-usage';
// import { OverviewHelp } from 'src/sections/dashboard/overview/overview-help';
// import { OverviewJobs } from 'src/sections/dashboard/overview/overview-jobs';
// import { OverviewOpenTickets } from 'src/sections/dashboard/overview/overview-open-tickets';
// import { OverviewTips } from 'src/sections/dashboard/overview/overview-tips';

const now = new Date();

const Page = () => {
    const settings = useSettings();

    usePageView();

    return (
        <>
            <Seo title="App: Overview"/>
            <HomeApp/>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
