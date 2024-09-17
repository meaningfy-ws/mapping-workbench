import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {testDataSuitesApi} from 'src/api/test-data-suites';
import {sparqlTestSuitesApi} from 'src/api/sparql-test-suites';
import {shaclTestSuitesApi} from 'src/api/shacl-test-suites';
import {resourceCollectionsApi} from 'src/api/resource-collections';

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
  const section = sectionApi.section;
  let editCustomPathName = "";
  let deleteCutomPathName = "";

  //const itemctx = new ForListItemAction(id, testDataSuitesApi);
  let itemctx = {};

  
  switch(section) {
            case 'test_data_suites':
              editCustomPathName = paths.app.test_data_suites.edit;
              deleteCutomPathName = paths.app.test_data_suites.index;
              itemctx = new ForListItemAction(id, testDataSuitesApi);

            break;
            case 'sparql_test_suites':
              editCustomPathName = paths.app.sparql_test_suites.edit;
              deleteCutomPathName = paths.app.sparql_test_suites.index;
              itemctx = new ForListItemAction(id, sparqlTestSuitesApi);
                    
            break;
            case 'shacl_test_suites':
              editCustomPathName = paths.app.shacl_test_suites.edit;
              deleteCutomPathName = paths.app.shacl_test_suites.index;
              itemctx = new ForListItemAction(id, shaclTestSuitesApi);

            break;
            case 'resource_collections':
              editCustomPathName = paths.app.resource_collections.edit;
              deleteCutomPathName = paths.app.resource_collections.index;
              itemctx = new ForListItemAction(id, resourceCollectionsApi);
                    
            break;
            
            
            default:
                break;                    
  }

  const handleDeleteAction = useCallback(async () => {
    const response = await itemctx.api.deleteItem(id);    
    
    router.push({
        pathname: deleteCutomPathName
    });
    //window.location.reload();
}, [router, itemctx]);

  

  const handleEditAction = useCallback(async () => {       

    router.push({
      pathname: editCustomPathName,
      query: {id: id}
    });

  }, [router]);

  return (
    <Card {...other}>
      <CardActions sx={{ justifyContent: "end" }}>
        <Button
            id='edit_button'
            variant="contained"
            size="large"
            onClick={handleEditAction}
            sx={{ color: "#ffffff",backgroundColor: "#2970FF", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.08)", borderRadius: "12px", minWidth: "100px" }}
        >
          Edit
        </Button>
        <Button
            id='delete_button'
            variant="contained"            
            size="large"
            color="error"
            onClick={handleDeleteAction}
            sx={{  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.08)", borderRadius: "12px", minWidth: "100px" }}
        >
          Delete
        </Button>
      </CardActions>
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
