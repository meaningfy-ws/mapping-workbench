import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CompanyMember } from './company-member';

export const CompanyTeam = (props) => {
  const { members = [], ...other } = props;

  return (
    <Stack
      spacing={3}
      {...other}>
      <div>
        <Typography variant="h6">
          Team ({members.length})
        </Typography>
      </div>
      <div>
        <Grid
          container
          spacing={3}
        >
          {members.map((member) => (
            <Grid
              item
              key={member.id}
              xs={12}
              sm={6}
            >
              <CompanyMember member={member} />
            </Grid>
          ))}
        </Grid>
      </div>
    </Stack>
  );
};

CompanyTeam.propTypes = {
  members: PropTypes.array
};
