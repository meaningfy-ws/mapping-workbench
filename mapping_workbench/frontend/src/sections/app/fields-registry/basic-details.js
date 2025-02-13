import Card from '@mui/material/Card';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {useHighlighterTheme} from "../../../hooks/use-highlighter-theme";

export const BasicDetails = (props) => {
    const {item, ...other} = props;
    const syntaxHighlighterTheme = useHighlighterTheme()

    return (
        <>
            <Card>
                <PropertyList>
                    <PropertyListItem
                        divider
                        label="Element ID"
                        value={item.sdk_element_id}
                    />
                    <PropertyListItem
                        divider
                        label="Name"
                        value={item.name}
                    />
                    <PropertyListItem
                        divider
                        label="Parent ID"
                        value={item.parent_node_id}
                    />
                    <PropertyListItem
                        divider
                        label="Absolute XPath"
                        value={<SyntaxHighlighter language="xquery"
                                                  style={syntaxHighlighterTheme}>
                            {item.absolute_xpath}
                        </SyntaxHighlighter>}
                    />
                    <PropertyListItem
                        divider
                        label="Relative XPath"
                        value={<SyntaxHighlighter language="xquery"
                                                  style={syntaxHighlighterTheme}>
                            {item.relative_xpath}
                        </SyntaxHighlighter>}
                    />
                    <PropertyListItem
                        divider
                        label="Repeatable"
                        value={item.repeatable}
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
                            {item.versions.map((version, i) =>
                                <ListItem key={"version" + i}>{version}</ListItem>
                            )}
                        </List>
                        <List>
                            {item.descriptions.map((description, i) =>
                                <ListItem key={"description" + i}>{description}</ListItem>
                            )}
                        </List>
                    </small>
                </PropertyList>

            </Card>
        </>

    )
        ;
};

