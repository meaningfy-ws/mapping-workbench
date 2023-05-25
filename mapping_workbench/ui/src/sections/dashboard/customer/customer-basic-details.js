import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';

import { PropertyList } from 'src/components/property-list';
import { PropertyListItem } from 'src/components/property-list-item';

export const CustomerBasicDetails = (props) => {
  const { address1, address2, country, email, isVerified, phone, state, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Basic Details" />
      <PropertyList>
        <PropertyListItem
          divider
          label="Email"
          value={email}
        />
        <PropertyListItem
          divider
          label="Phone"
          value={phone}
        />
        <PropertyListItem
          divider
          label="Country"
          value={country}
        />
        <PropertyListItem
          divider
          label="State/Region"
          value={state}
        />
        <PropertyListItem
          divider
          label="Address 1"
          value={state}
        />
        <PropertyListItem
          divider
          label="Address 2"
          value={address2}
        />
      </PropertyList>
      <CardActions>
        <Button
          color="inherit"
          size="small"
        >
          Reset Password
        </Button>
      </CardActions>
    </Card>
  );
};

CustomerBasicDetails.propTypes = {
  address1: PropTypes.string,
  address2: PropTypes.string,
  country: PropTypes.string,
  email: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
  phone: PropTypes.string,
  state: PropTypes.string
};
