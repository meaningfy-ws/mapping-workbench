import {useCallback, useState} from 'react';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import {projectsApi as sectionApi} from 'src/api/projects';
import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {paths} from 'src/paths';
import {ProjectBasicDetails} from 'src/sections/app/project/project-basic-details';
import {useRouter} from "src/hooks/use-router";
import {useItem} from "src/contexts/app/section/for-item-data-state";

const tabs = [
  { label: 'Details', value: 'details' }
];

const Page = () => {
  const router = useRouter();
  if(!router.isReady) return;

  const { id } = router.query;

  if (!id) {
    return;
  }

  const formState = useItem(sectionApi, id);
  const item = formState.item;

  usePageView();
  const [currentTab, setCurrentTab] = useState('details');

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  if (!item) {
    return;
  }

  return (
    <>
      <Seo title={`App: ${sectionApi.SECTION_ITEM_TITLE} View`}/>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.app[sectionApi.section].index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex'
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">
                    {sectionApi.SECTION_TITLE}
                  </Typography>
                </Link>
              </div>
              <Stack
                  alignItems="flex-start"
                  direction={{
                    xs: 'column',
                    md: 'row'
                  }}
                  justifyContent="space-between"
                  spacing={4}
              >
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                >
                  <Stack spacing={1}>
                    <Typography variant="h4">
                      {item.title}
                    </Typography>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                    >
                      <Typography variant="subtitle2">
                        {item.name}:
                      </Typography>
                      <Chip
                          label={item._id}
                          size="small"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ mt: 3 }}
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
            {currentTab === 'details' && (
              <div>
                <Grid
                  container
                  spacing={4}
                >
                  <Grid
                    xs={12}
                    lg={12}
                  >
                    <ProjectBasicDetails
                      id={item.id}
                      name={item.name}
                      title={item.title}
                      description={item.description}
                      version={item.version}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
          </Stack>
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
