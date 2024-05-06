import {Fragment, useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";

import {paths} from "src/paths";
import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {PropertyList} from "../../../components/property-list";
import {PropertyListItem} from "../../../components/property-list-item";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;


    const [currentItem, setCurrentItem] = useState(null);

    const handleItemToggle = useCallback((itemId) => {
        setCurrentItem((prevItemId) => {
            if (prevItemId === itemId) {
                return null;
            }

            return itemId;
        });
    }, []);

    // const handleItemClose = useCallback(() => {
    //     setCurrentItem(null);
    // }, []);

    // const handleItemUpdate = useCallback(() => {
    //     setCurrentItem(null);
    //     toast.success('Item updated');
    // }, []);

    // const handleItemDelete = useCallback(() => {

    //     toast.error('Item cannot be deleted');
    // }, []);

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
            />
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Element
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Parent
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                Versions
                            </TableCell>
                            <TableCell>
                                Type
                            </TableCell>
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
                                                {item.eforms_sdk_element_id}
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
                                                    view: () => paths.app[sectionApi.section].elements.view(item_id)
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
                                                                            wrapLines={true}
                                                                            lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}>
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
                                                                            wrapLines={true}
                                                                            lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}>
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
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />
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
