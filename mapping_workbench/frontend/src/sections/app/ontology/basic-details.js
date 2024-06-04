import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {ontologyNamespacesApi as sectionApi} from 'src/api/ontology-namespaces';

import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import {useCallback} from "react";
import {paths} from "../../../paths";
import {useRouter} from "../../../hooks/use-router";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

export const BasicDetails = (props) => {
    const {id, prefix, uri, is_syncable, ...other} = props;

    const router = useRouter();
    const itemctx = new ForListItemAction(id, sectionApi);

    const handleEditAction = useCallback(async () => {
        router.push({
            //pathname: paths.app[item.api.section].edit,
            pathname: paths.app.ontology_namespaces.edit, query: {id: id}
        });

    }, [router]);

    const handleDeleteAction = useCallback(async () => {
        const response = await itemctx.api.deleteItem(id);

        router.push({
            pathname: paths.app.ontology_namespaces.index
        });
        //window.location.reload();
    }, [router, itemctx]);

    return (
        <>
            <Card>
                <CardHeader title="Details"/>
                <PropertyList>
                    <PropertyListItem
                        divider
                        label="Prefix"
                        value={prefix}
                    />
                    <PropertyListItem
                        divider
                        label="URI"
                        value={uri}
                    />
                    <PropertyListItem
                        divider
                        label="Syncable"
                        value={<Switch
                            disabled
                            checked={is_syncable}
                            value={is_syncable}
                        />}
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
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleEditAction}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={handleDeleteAction}
                    >
                        Delete
                    </Button>
                </Stack>
            </Card>
        </>

    )
        ;
};

BasicDetails.propTypes = {
    id: PropTypes.string.isRequired, prefix: PropTypes.string, uri: PropTypes.string, is_syncable: PropTypes.string
};
