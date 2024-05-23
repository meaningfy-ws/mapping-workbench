import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {ontologyTermsApi as sectionApi} from 'src/api/ontology-terms';

import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import {useCallback} from "react";
import {paths} from "../../../paths";
import {useRouter} from "../../../hooks/use-router";

export const BasicDetails = (props) => {
    const {id, term, short_term, type, ...other} = props;

    const router = useRouter();
    const itemctx = new ForListItemAction(id, sectionApi);

    const handleEditAction = useCallback(async () => {
        router.push({
            //pathname: paths.app[item.api.section].edit,
            pathname: paths.app.ontology_terms.edit,
            query: {id: id}
        });

    }, [router]);

    const handleDeleteAction = useCallback(async () => {
        const response = await itemctx.api.deleteItem(id);

        router.push({
            pathname: paths.app.ontology_terms.index
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
                        label="Short Term"
                        value={short_term}
                    />
                    <PropertyListItem
                        divider
                        label="Term"
                        value={term}
                    />
                    <PropertyListItem
                        divider
                        label="Type"
                        value={type}
                    />
                </PropertyList>

            </Card>
            <CardActions>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleEditAction}
                >
                    Edit
                </Button>
                <Button
                    variant="text"
                    size="small"
                    color="error"
                    onClick={handleDeleteAction}
                >
                    Delete
                </Button>
            </CardActions>
        </>
    );
};

BasicDetails.propTypes = {
    id: PropTypes.string.isRequired,
    term: PropTypes.string,
    type: PropTypes.string
};
