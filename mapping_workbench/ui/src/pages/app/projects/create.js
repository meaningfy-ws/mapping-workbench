import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as AppLayout } from 'src/layouts/app';
import { paths } from 'src/paths';
import { ProjectCreateForm } from 'src/sections/app/project/project-create-form';

const Page = () => {
  usePageView();

  return (
    <>
      <Seo title="Project Create" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">
                Create a new project
              </Typography>
              <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.app.index}
                  variant="subtitle2"
                >
                  App
                </Link>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.app.projects.index}
                  variant="subtitle2"
                >
                  Projects
                </Link>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  Create
                </Typography>
              </Breadcrumbs>
            </Stack>
            <ProjectCreateForm />
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
