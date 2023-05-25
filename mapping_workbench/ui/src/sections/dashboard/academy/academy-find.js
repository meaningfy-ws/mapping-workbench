import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import FilePlus02Icon from '@untitled-ui/icons-react/build/esm/FilePlus02';
import UserPlus02Icon from '@untitled-ui/icons-react/build/esm/UserPlus02';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

export const AcademyFind = () => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          divider={<Divider />}
          spacing={2}
        >
          <Stack
            alignItems="flex-start"
            direction="row"
            spacing={2}
          >
            <SvgIcon>
              <FilePlus02Icon />
            </SvgIcon>
            <div>
              <Typography variant="subtitle1">
                Find courses
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Browse through the directory
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  endIcon={<ChevronRightIcon />}
                  size="small"
                  variant="contained"
                >
                  Find Courses
                </Button>
              </Box>
            </div>
          </Stack>
          <Stack
            alignItems="flex-start"
            direction="row"
            spacing={2}
          >
            <SvgIcon>
              <UserPlus02Icon />
            </SvgIcon>
            <div>
              <Typography variant="subtitle1">
                Find tutors
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Browse the latest written articles
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  color="info"
                  endIcon={<ChevronRightIcon />}
                  size="small"
                  variant="contained"
                >
                  Find Tutors
                </Button>
              </Box>
            </div>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
