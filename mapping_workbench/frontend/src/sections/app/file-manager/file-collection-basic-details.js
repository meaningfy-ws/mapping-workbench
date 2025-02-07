import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CardHeader from '@mui/material/CardHeader';

import {paths} from "src/paths";
import {useRouter} from "src/hooks/use-router";
import {PropertyList} from 'src/components/property-list';
import {testDataSuitesApi} from 'src/api/test-data-suites';
import {shaclTestSuitesApi} from 'src/api/shacl-test-suites';
import {sparqlTestSuitesApi} from 'src/api/sparql-test-suites';
import {resourceCollectionsApi} from 'src/api/resource-collections';
import {PropertyListItem} from 'src/components/property-list-item';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import CardActions from "@mui/material/CardActions";

export const FileCollectionBasicDetails = (props) => {
        const {id, name, title, description, sectionApi, version, ...other} = props;
        const router = useRouter();
        const section = sectionApi.section;
        let editCustomPathName = "";
        let deleteCutomPathName = "";

        //const itemctx = new ForListItemAction(id, testDataSuitesApi);
        let itemctx = {};


        switch (section) {
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

        const handleDeleteAction = () => {
            itemctx.api.deleteItem(id)
                .then(res => router.push({pathname: deleteCutomPathName}))
                .catch(err => console.error(err))
            //window.location.reload();
        }


        const handleEditAction = () => {
            router.push({
                pathname: editCustomPathName,
                query: {id: id}
            });
        }

        return (
            <>
                <Card {...other}>

                    <CardHeader title="Basic Details"/>
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

                <Card sx={{mt: 3}}>
                    <Stack
                        direction={{
                            xs: 'column',
                            sm: 'row'
                        }}
                        flexWrap="wrap"
                        spacing={3}
                        sx={{p: 3}}
                    >
                        <CardActions>
                            <Button
                                id='edit_button'
                                type='submit'
                                variant="contained"
                                onClick={handleEditAction}
                            >
                                Edit
                            </Button>
                            <Button
                                id='delete_button'
                                color="error"
                                onClick={handleDeleteAction}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Stack>
                </Card>
            </>
        );
    }
;

FileCollectionBasicDetails.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    version: PropTypes.string
};
