import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));

  usePageView();

  return (
    <>
      <Seo title="Error: Not Found" />
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          py: '80px'
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 6
            }}
          >
              <ErrorOutlineIcon sx={{ fontSize: 400 }}/>
          </Box>
          <Typography
            align="center"
            variant={mdUp ? 'h1' : 'h4'}
          >
            424: Some parameters of request are wrong
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <Button
              component={RouterLink}
              href={paths.index}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
