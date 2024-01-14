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
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";

export const BasicDetails = (props) => {
    const {item, ...other} = props;

    return (
        <>
            <Card>
                <PropertyList>
                    <PropertyListItem
                        divider
                        label="Element ID"
                        value={item.eforms_sdk_element_id}
                    />
                    <PropertyListItem
                        divider
                        label="Absolute XPath"
                        value={item.absolute_xpath}
                    />
                    <PropertyListItem
                        divider
                        label="Relative XPath"
                        value={item.relative_xpath}
                    />
                    <PropertyListItem
                        divider
                        label="Repeatable"
                        value={item.repeatable}
                    />
                    <PropertyListItem
                        divider
                        label="Parent ID"
                        value={item.parent_node_id}
                    />
                    <PropertyListItem
                        divider
                        label="Name"
                        value={item.name}
                    />
                    <PropertyListItem
                        divider
                        label="BT ID"
                        value={item.bt_id}
                    />
                    <PropertyListItem
                        divider
                        label="Value Type"
                        value={item.value_type}
                    />
                    <PropertyListItem
                        divider
                        label="Legal Type"
                        value={item.legal_type}
                    />
                    <PropertyListItem
                        divider
                        label="Element Type"
                        value={item.element_type}
                    />
                    <small>
                        <List>
                            {item.versions.map((version) => {
                                return (
                                    <ListItem>{version}</ListItem>
                                )
                            })}
                        </List>
                        <List>
                            {item.descriptions.map((description) => {
                                return (
                                    <ListItem>{description}</ListItem>
                                )
                            })}
                        </List>
                    </small>
                </PropertyList>

            </Card>
        </>

    )
        ;
};

BasicDetails.propTypes = {};
