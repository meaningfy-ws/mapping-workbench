import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { CourseSummary } from 'src/sections/dashboard/academy/course-summary';
import { CourseChapter } from 'src/sections/dashboard/academy/course-chapter';

const useCourse = () => {
  return {
    id: 'c3a2b7331eef8329e2a87c79',
    chapters: [
      {
        title: 'Introduction',
        description: 'Introducing the app and how it works',
        lesson: ''
      },
      {
        title: 'Installing required packages',
        description: 'Introducing the library and how it works',
        lesson: `
Alias animi labque, deserunt distinctio eum excepturi fuga iure labore magni molestias mollitia natus, officia pofro quis sunt 
temporibus veritatis voluptatem, voluptatum. Aut blanditiis esse et illum maxim, obcaecati possimus voluptate! Accusamus adipisci 
amet aperiam, assumenda consequuntur fugiat inventore iusto magnam molestias natus necessitatibus, nulla pariatur.

Adipisci alias animi debitis eos et impedit maiores, modi nam nobis officia optio perspiciatis, rerum. Accusantium esse nostrum odit quis quo:

\`\`\`ts
const mongoose = require('mongoose'),
const uniqueValidator = require('mongoose-unique-validator'),
const bcrypt = require('bcrypt'),

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;
  
const Email = new Schema({
  address: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\\S+@\\S+\\.\\S+/, 'is invalid'],
    index: true,
  },
  // Change the default to true if you don't need to validate a new user's email address
  validated: { type: Boolean, default: false },
});
\`\`\`
`
      },
      {
        title: 'Step title',
        description: 'Introducing the library and how it works',
        lesson: ''
      }
    ],
    description: 'Introductory course for design and framework basics',
    duration: '78 hours',
    progress: 50,
    title: 'React and Redux Tutorial'
  };
};

const Page = () => {
  const course = useCourse();

  usePageView();

  const activeChapter = 1;
  const chapter = course.chapters[activeChapter];

  return (
    <>
      <Seo title="Dashboard: Academy Course" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Stack spacing={3}>
                <div>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.dashboard.academy.index}
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
                      Academy
                    </Typography>
                  </Link>
                </div>
                <CourseSummary
                  activeChapter={activeChapter}
                  course={course}
                />
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              {chapter && <CourseChapter chapter={chapter} />}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
