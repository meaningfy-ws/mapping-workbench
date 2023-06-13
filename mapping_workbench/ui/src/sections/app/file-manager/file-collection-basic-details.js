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

export const FileCollectionBasicDetails = (props) => {
  const { id, name, title, description, sectionApi, version, ...other } = props;
  const router = useRouter();
  const section = props.sectionApi;
  let customPathName = "";
  console.log("section: ", section);
  console.log("ID: ", id);
  
  switch(section) {
            case 'test_data_suites':
              customPathName = paths.app.test_data_suites.edit;
                    
            break;
            case 'sparql_test_suites':
              customPathName = paths.app.sparql_test_suites.edit;
                    
            break;
            case 'shacl_test_suites':
              customPathName = paths.app.shacl_test_suites.edit;
                    
            break;
            case 'ontology_file_collections':
              customPathName = paths.app.ontology_file_collections.edit;
                    
            break;
            case 'resource_collections':
              customPathName = paths.app.resource_collections.edit;
                    
            break;
            
            
            default:
                break;                    
  }

  // const handleEditAction = useCallback(async () => {
  //   router.push({
  //     //pathname: paths.app[item.api.section].edit,
  //     pathname: paths.app.projects.edit,
  //     query: {id: id}
  //   });

  // }, [router]);

  

  const handleEditAction = useCallback(async () => {       

    router.push({
      pathname: customPathName,
      query: {id: id}
    });

  }, [router]);

  return (
    <Card {...other}>
      <CardHeader title="Basic Details" />
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

FileCollectionBasicDetails.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  version: PropTypes.string
};
