import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";

import {FileResourceCollectionsCard} from "../file-manager/file-resource-collections-card";
import {testDataSuitesApi} from "../../../api/test-data-suites";
import {shaclTestSuitesApi} from "../../../api/shacl-test-suites";
import {sparqlTestSuitesApi} from "../../../api/sparql-test-suites";
import {resourceCollectionsApi} from "../../../api/resource-collections";

const Resources = ({item}) => {
    return (
        <Grid container
              spacing={3}>
            <Grid md={12}
                  xs={12}>
                <FileResourceCollectionsCard
                    collectionApi={testDataSuitesApi}
                    filters={{
                        ids: ((item.test_data_suites || []).length > 0
                            && item.test_data_suites.map(x => x.id)) || ''
                    }}
                />
                <Divider sx={{m: 3}}/>
                <FileResourceCollectionsCard
                    collectionApi={shaclTestSuitesApi}
                    filters={{
                        ids: ((item.shacl_test_suites || []).length > 0
                            && item.shacl_test_suites.map(x => x.id)) || ''
                    }}
                />
                <Divider sx={{m: 3}}/>
                <FileResourceCollectionsCard
                    collectionApi={sparqlTestSuitesApi}
                    filters={{
                        ids: ((item.sparql_test_suites || []).length > 0
                            && item.sparql_test_suites.map(x => x.id)) || ''
                    }}
                />
                <Divider sx={{m: 3}}/>
                <FileResourceCollectionsCard
                    collectionApi={resourceCollectionsApi}
                    filters={{
                        ids: ((item.resource_collections || []).length > 0
                            && item.resource_collections.map(x => x.id)) || ''
                    }}
                />
            </Grid>
        </Grid>
    )
}

export default Resources