import {useCallback, useState} from 'react';
import {subDays, subHours, subMinutes, subMonths} from 'date-fns';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {AccountGeneralSettings} from 'src/sections/app/account/account-general-settings';
import {AccountNotificationsSettings} from 'src/sections/app/account/account-notifications-settings';
import {AccountTeamSettings} from 'src/sections/app/account/account-team-settings';
import {AccountSecuritySettings} from 'src/sections/app/account/account-security-settings';

const now = new Date();

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Team', value: 'team' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Security', value: 'security' }
];

const Page = () => {
  const user = {};
  const [currentTab, setCurrentTab] = useState('general');

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title="App: Account" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Typography variant="h4">
              Account
            </Typography>
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {currentTab === 'general' && (
            <AccountGeneralSettings
              avatar={user.avatar || ''}
              email={user.email || ''}
              name={user.name || ''}
            />
          )}
          {currentTab === 'team' && (
            <AccountTeamSettings
              members={[
                {
                  avatar: '/assets/avatars/avatar-cao-yu.png',
                  email: 'cao.yu@devias.io',
                  name: 'Cao Yu',
                  role: 'Owner'
                },
                {
                  avatar: '/assets/avatars/avatar-siegbert-gottfried.png',
                  email: 'siegbert.gottfried@devias.io',
                  name: 'Siegbert Gottfried',
                  role: 'Standard'
                }
              ]}
            />
          )}
          {currentTab === 'notifications' && <AccountNotificationsSettings />}
          {currentTab === 'security' && (
            <AccountSecuritySettings
              loginEvents={[
                {
                  id: '1bd6d44321cb78fd915462fa',
                  createdAt: subDays(subHours(subMinutes(now, 5), 7), 1).getTime(),
                  ip: '95.130.17.84',
                  type: 'Credential login',
                  userAgent: 'Chrome, Mac OS 10.15.7'
                },
                {
                  id: 'bde169c2fe9adea5d4598ea9',
                  createdAt: subDays(subHours(subMinutes(now, 25), 9), 1).getTime(),
                  ip: '95.130.17.84',
                  type: 'Credential login',
                  userAgent: 'Chrome, Mac OS 10.15.7'
                }
              ]}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AppLayout>
    {page}
  </AppLayout>
);

export default Page;
