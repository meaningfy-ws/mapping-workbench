import Attachment01Icon from '@untitled-ui/icons-react/build/esm/Attachment01';
import FaceSmileIcon from '@untitled-ui/icons-react/build/esm/FaceSmile';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import Link01Icon from '@untitled-ui/icons-react/build/esm/Link01';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { getInitials } from 'src/utils/get-initials';

export const SocialPostAdd = (props) => {
  const user = useMockedUser();
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  return (
    <Card {...props}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          spacing={2}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 40,
              width: 40
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Stack
            spacing={3}
            sx={{ flexGrow: 1 }}
          >
            <OutlinedInput
              fullWidth
              multiline
              placeholder="What's on your mind"
              rows={3}
            />
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              {smUp && (
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <IconButton>
                    <SvgIcon>
                      <Image01Icon />
                    </SvgIcon>
                  </IconButton>
                  <IconButton>
                    <SvgIcon>
                      <Attachment01Icon />
                    </SvgIcon>
                  </IconButton>
                  <IconButton>
                    <SvgIcon>
                      <Link01Icon />
                    </SvgIcon>
                  </IconButton>
                  <IconButton>
                    <SvgIcon>
                      <FaceSmileIcon />
                    </SvgIcon>
                  </IconButton>
                </Stack>
              )}
              <div>
                <Button variant="contained">
                  Post
                </Button>
              </div>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
