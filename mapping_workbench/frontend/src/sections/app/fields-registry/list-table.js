import {Fragment, useState} from 'react';
import PropTypes from 'prop-types';

import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import TableRow from '@mui/material/TableRow';
import ListItem from "@mui/material/ListItem";
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import {paths} from "src/paths";
import {Scrollbar} from 'src/components/scrollbar';
import {PropertyList} from "src/components/property-list";
import {PropertyListItem} from "src/components/property-list-item";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import TablePagination from "src/sections/components/table-pagination";
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import TableSorterHeader from "src/sections/components/table-sorter-header";
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {useHighlighterTheme} from "../../../hooks/use-highlighter-theme";


export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        sort,
        onSort = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const syntaxHighlighterTheme = useHighlighterTheme()
    const [currentItem, setCurrentItem] = useState(null);

    const handleItemToggle = itemId =>
        setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId)

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableCell>
                <TableSorterHeader sort={{direction, column: sort.column}}
                                   onSort={onSort}
                                   {...props}
                />
            </TableCell>
        )
    }

    return (
        <div>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
                showFirstButton
                showLastButton
            >
                <Scrollbar>
                    <Table sx={{minWidth: 1200}}>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <SorterHeader fieldName='sdk_element_id'
                                              title='Element'/>
                                <SorterHeader fieldName='parent_node_id'
                                              title='Parent'/>
                                <TableCell>
                                    Versions
                                </TableCell>
                                <SorterHeader fieldName='element_type'
                                              title='Type'/>
                                <TableCell align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const item_id = item._id;
                                const isCurrent = item_id === currentItem;

                                return (
                                    <Fragment key={item_id}>
                                        <TableRow
                                            hover
                                            key={item_id}
                                        >
                                            <TableCell
                                                padding="checkbox"
                                                sx={{
                                                    ...(isCurrent && {
                                                        position: 'relative',
                                                        '&:after': {
                                                            position: 'absolute',
                                                            content: '" "',
                                                            top: 0,
                                                            left: 0,
                                                            backgroundColor: 'primary.main',
                                                            width: 3,
                                                            height: 'calc(100% + 1px)'
                                                        }
                                                    })
                                                }}
                                                width="25%"
                                            >
                                                <IconButton onClick={() => handleItemToggle(item_id)}>
                                                    <SvgIcon>
                                                        {isCurrent ? <ChevronDownIcon/> : <ChevronRightIcon/>}
                                                    </SvgIcon>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2">
                                                    {item.sdk_element_id}
                                                </Typography>
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.parent_node_id}
                                            </TableCell>
                                            <TableCell>
                                                <List sx={{
                                                    whiteSpace: 'nowrap',
                                                    padding: 0,
                                                    margin: 0
                                                }}>
                                                    {item.versions.sort().map((version) => {
                                                        return (
                                                            <ListItem
                                                                key={version}
                                                                sx={{
                                                                    padding: 0,
                                                                    margin: 0
                                                                }}
                                                            >{version}</ListItem>
                                                        )
                                                    })}
                                                </List>
                                            </TableCell>
                                            <TableCell>
                                                {item.element_type}
                                            </TableCell>
                                            <TableCell align="right">
                                                <ListItemActions
                                                    itemctx={new ForListItemAction(item_id, sectionApi)}
                                                    pathnames={{
                                                        view: () => paths.app.fields_and_nodes.overview.elements.view(item_id)
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        {isCurrent && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    sx={{
                                                        p: 0,
                                                        position: 'relative',
                                                        '&:after': {
                                                            position: 'absolute',
                                                            content: '" "',
                                                            top: 0,
                                                            left: 0,
                                                            backgroundColor: 'primary.main',
                                                            width: 3,
                                                            height: 'calc(100% + 1px)'
                                                        }
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Grid container>
                                                            <Grid
                                                                item
                                                                md={12}
                                                                xs={12}
                                                            >
                                                                <PropertyList>
                                                                    <PropertyListItem
                                                                        label="Absolute XPath"
                                                                        value={
                                                                            <SyntaxHighlighter
                                                                                language="xquery"
                                                                                wrapLines
                                                                                style={syntaxHighlighterTheme}
                                                                                lineProps={{
                                                                                    style: {
                                                                                        wordBreak: 'break-all',
                                                                                        whiteSpace: 'pre-wrap'
                                                                                    }
                                                                                }}>
                                                                                {item.absolute_xpath}
                                                                            </SyntaxHighlighter>
                                                                        }
                                                                        sx={{
                                                                            whiteSpace: "pre-wrap",
                                                                            px: 3,
                                                                            py: 1.5
                                                                        }}
                                                                    />
                                                                    <PropertyListItem
                                                                        label="Relative XPath"
                                                                        value={
                                                                            <SyntaxHighlighter
                                                                                language="xquery"
                                                                                wrapLines
                                                                                style={syntaxHighlighterTheme}
                                                                                lineProps={{
                                                                                    style: {
                                                                                        wordBreak: 'break-all',
                                                                                        whiteSpace: 'pre-wrap'
                                                                                    }
                                                                                }}>
                                                                                {item.relative_xpath}
                                                                            </SyntaxHighlighter>
                                                                        }
                                                                        sx={{
                                                                            whiteSpace: "pre-wrap",
                                                                            px: 3,
                                                                            py: 1.5
                                                                        }}
                                                                    />
                                                                </PropertyList>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                    <Divider/>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TablePagination>
        </div>
    );
};

ListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
