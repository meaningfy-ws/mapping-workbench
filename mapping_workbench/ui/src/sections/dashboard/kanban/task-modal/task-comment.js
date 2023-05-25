import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useSelector } from 'src/store';

const useAuthor = (authorId) => {
  return useSelector((state) => {
    const { members } = state.kanban;

    return members.byId[authorId] || null;
  });
};

export const TaskComment = (props) => {
  const { comment, ...other } = props;
  const author = useAuthor(comment.authorId);

  const avatar = author?.avatar || undefined;
  const createdAt = format(comment.createdAt, 'MMM dd, yyyy \'at\' hh:mm a');

  return (
    <Stack
      alignItems="flex-start"
      direction="row"
      spacing={2}
      {...other}>
      <Avatar src={avatar} />
      <Stack
        spacing={1}
        sx={{ flexGrow: 1 }}
      >
        <Typography variant="subtitle2">
          {author?.name}
        </Typography>
        <Paper
          sx={{
            backgroundColor: (theme) => theme.palette.mode === 'dark'
              ? 'neutral.800'
              : 'neutral.50',
            p: 2
          }}
          variant="outlined"
        >
          <Typography variant="body2">
            {comment.message}
          </Typography>
        </Paper>
        <Typography
          color="text.secondary"
          component="p"
          variant="caption"
        >
          {createdAt}
        </Typography>
      </Stack>
    </Stack>
  );
};

TaskComment.propTypes = {
  comment: PropTypes.objectOf(PropTypes.any).isRequired
};
