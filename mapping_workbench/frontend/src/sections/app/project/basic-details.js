import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CardActions from "@mui/material/CardActions";

import {paths} from "../../../paths";
import {useRouter} from "next/router";

import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {projectsApi} from 'src/api/projects';
import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';

export const BasicDetails = (props) => {
    const {
        id, name, title, description, version,
        ssTitle, ssDescription, ssVersion, ssType,
        toTitle, toDescription, toVersion, toUri, ...other
    } = props;

    const router = useRouter();
    const itemctx = new ForListItemAction(id, projectsApi);


    const handleEditAction = async () => {
        router.push({
            pathname: paths.app.projects.edit,
            query: {id: id}
        });

    }

    const handleDeleteAction = async () => {
        itemctx.api.deleteItem(id)
            .then(() => {
                router.push({
                    pathname: paths.app.projects.index
                });
            })
    }

    return (
        <>
            <Card>
                <CardHeader title="Details"/>
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

                <CardHeader title="Source Schema"/>
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

                <CardHeader title="Target Ontology"/>
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
                            variant="contained"
                            size="large"
                            onClick={handleEditAction}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
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
};

BasicDetails.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    version: PropTypes.string
};
