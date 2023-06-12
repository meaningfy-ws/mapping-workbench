import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import {useCallback} from "react";
import {paths} from "../../../paths";
import {useRouter} from "../../../hooks/use-router";

export const ProjectBasicDetails = (props) => {
  const { id, name, title, description, version, ...other } = props;  
  const router = useRouter();
  
    
  console.log("props: ", props);
  console.log("pathname: ", paths.app.projects.edit);


  const handleEditAction = useCallback(async () => {
    router.push({
      //pathname: paths.app[item.api.section].edit,
      pathname: paths.app.projects.edit,
      query: {id: id}
    });

  }, [router]);

  return (
    <Card {...other}>
      <CardHeader title="Basic Details" />
      <PropertyList>
        <PropertyListItem
          divider
          label="Name"
          value={name}
        />
        <PropertyListItem
          divider
          label="Title"
          value={title}
        />
        <PropertyListItem
          divider
          label="Description"
          value={description}
        />
        <PropertyListItem
          divider
          label="Version"
          value={version}
        />
      </PropertyList>
      <CardActions>
        <Button
            color="inherit"
            size="small"
            onClick={handleEditAction}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

ProjectBasicDetails.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  version: PropTypes.string
};
