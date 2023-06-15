import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { ForListItemAction } from 'src/contexts/app/section/for-list-item-action';
import { projectsApi } from 'src/api/projects';

import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import {useCallback} from "react";
import {paths} from "../../../paths";
import {useRouter} from "../../../hooks/use-router";

export const ProjectBasicDetails = (props) => {
  const { id, name, title, description, version,
     ssTitle, ssDescription, ssVersion, ssType, 
     toTitle, toDescription, toVersion, toUri, ...other } = props;

  const router = useRouter();
  const itemctx = new ForListItemAction(id, projectsApi);
    
  console.log("props: ", props);
  console.log("intemctx: ", typeof(itemctx));
  

  const handleEditAction = useCallback(async () => {
    router.push({
      //pathname: paths.app[item.api.section].edit,
      pathname: paths.app.projects.edit,
      query: {id: id}
    });

  }, [router]);
  
  const handleDeleteAction = useCallback(async () => {
    const response = await itemctx.api.deleteItem(id);    
    
    router.push({
        pathname: paths.app.projects.index
    });
    //window.location.reload();
}, [router, itemctx]);

  return (
    
    <Card>
      <CardActions sx={{ justifyContent: "end" }}>
        <Button
            variant="contained"            
            size="large"
            onClick={handleEditAction}
            sx={{ color: "#ffffff",backgroundColor: "#2970FF", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.08)", borderRadius: "12px", minWidth: "100px" }}
        >
          Edit
        </Button>
        <Button
            variant="contained"            
            size="large"
            color="error"
            onClick={handleDeleteAction}
            sx={{  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.08)", borderRadius: "12px", minWidth: "100px" }}
        >
          Delete
        </Button>
      </CardActions>
      <CardHeader title="Details" />
      <PropertyList>        
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

      <CardHeader title="Source Schema" />
      <PropertyList>
        <PropertyListItem
          divider
          label="Title"
          value={ssTitle}
        />
        <PropertyListItem
          divider
          label="Description"
          value={ssDescription}
        />
        <PropertyListItem
          divider
          label="Version"
          value={ssVersion}
        />
        <PropertyListItem
          divider
          label="Type"
          value={ssType}
        />
      </PropertyList>

      <CardHeader title="Target Ontology" />
      <PropertyList>
        <PropertyListItem
          divider
          label="Title"
          value={toTitle}
        />
        <PropertyListItem
          divider
          label="Description"
          value={toDescription}
        />
        <PropertyListItem
          divider
          label="Version"
          value={toVersion}
        />
        <PropertyListItem
          divider
          label="URI"
          value={toUri}
        />
      </PropertyList>      
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
