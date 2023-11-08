import {Fragment, useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {toast} from 'react-hot-toast';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
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
import {useMounted} from 'src/hooks/use-mounted';

import {Scrollbar} from 'src/components/scrollbar';
import {useRouter} from "src/hooks/use-router";

import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import Tooltip from "@mui/material/Tooltip";
import {ListFileCollectionActions} from "src/components/app/list/list-file-collection-actions";
import {PropertyListItem} from 'src/components/property-list-item';
import {PropertyList} from "../../../components/property-list";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {paths} from "../../../paths";
import {Box} from "@mui/system";


export const ListTableRow = (props) => {
    const {
        item,
        item_id,
        isCurrent,
        handleItemToggle,
        sectionApi,
        router
    } = props;

    const [collectionResources, setCollectionResources] = useState([]);

    useEffect(() => {
        (async () => {
            await setCollectionResources((await sectionApi.getFileResources(item_id)).items);
        })()
    }, [sectionApi])


    const handleResourceEdit = useCallback(async (resource_id) => {
        router.push({
            pathname: paths.app[sectionApi.section].resource_manager.edit,
            query: {id: item_id, fid: resource_id}
        });

    }, [router, item, sectionApi]);

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
                <TableCell width="25%">
                    <Typography variant="subtitle2">
                        {item.title}
                    </Typography>
                </TableCell>
                <TableCell align="left">
                    {(item.created_at).replace("T", " ").split(".")[0]}
                </TableCell>
                <TableCell align="right">
                    <ListFileCollectionActions
                        itemctx={new ForListItemAction(item_id, sectionApi)}/>
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
                                    {item.description && (<PropertyList>
                                        <PropertyListItem
                                            label="Description"
                                            value={item.description}
                                            sx={{
                                                whiteSpace: "pre-wrap",
                                                px: 3,
                                                py: 1.5
                                            }}
                                        />
                                    </PropertyList>)}
                                </Grid>
                                <Grid
                                    md={12}
                                    xs={12}
                                    sx={{px: 3}}
                                >
                                    {collectionResources && collectionResources.length > 0 && (
                                        <Box sx={{mt: 2}}>
                                            <Stack divider={<Divider/>}>
                                                {collectionResources.map((resource) => {
                                                    return (
                                                        <Stack
                                                            alignItems="center"
                                                            direction="row"
                                                            flexWrap="wrap"
                                                            justifyContent="space-between"
                                                            key={item_id + "_" + resource._id}
                                                            sx={{
                                                                px: 2,
                                                                py: 1.5,
                                                            }}
                                                        >
                                                            <div>
                                                                <Typography
                                                                    variant="subtitle1">{resource.title}</Typography>
                                                                <Typography
                                                                    color="text.secondary"
                                                                    variant="caption"
                                                                >
                                                                    {}
                                                                </Typography>
                                                            </div>
                                                            <Stack
                                                                alignItems="center"
                                                                direction="row"
                                                                spacing={2}
                                                            >
                                                                <Button
                                                                    size="small"
                                                                    onClick={() => handleResourceEdit?.(resource._id)}
                                                                    color="success"
                                                                >Edit</Button>
                                                            </Stack>
                                                        </Stack>
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider/>
                    </TableCell>
                </TableRow>
            )}
        </Fragment>
    );
}
export const FileCollectionListTable = (props) => {
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

    const router = useRouter();


    const [currentItem, setCurrentItem] = useState(null);
    const isMounted = useMounted();

    // if(isMounted()){
    //     console.log("itemsWEneed: ", items[0]._id);
    //     const itemFileCollection = useItemsStoreFiles(items[0]._id);
    // }
    //const itemFileCollection = useItemsStoreFiles(items[0]._id);
    //console.log("itemFileCollection: ", itemFileCollection);

    const handleItemToggle = useCallback((itemId) => {
        setCurrentItem((prevItemId) => {
            if (prevItemId === itemId) {
                return null;
            }

            return itemId;
        });
        //useItemsStoreFiles(itemId);
    }, []);

    const handleItemClose = useCallback(() => {
        setCurrentItem(null);
    }, []);

    const handleItemUpdate = useCallback(() => {
        setCurrentItem(null);
        toast.success('Item updated');
    }, []);

    const handleItemDelete = useCallback(() => {
        toast.error('Item cannot be deleted');
    }, []);

    //console.log("date before: ", items);
    //console.log(" items[0].created_at ",(items[0].created_at).replace("T", " ").split(".")[0]);

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
                            <TableCell width="25%">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        direction="asc"
                                    >
                                        Title
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell align="left">
                                <Tooltip
                                    enterDelay={300}
                                    title="Sort"
                                >
                                    <TableSortLabel
                                        active
                                        direction="desc"
                                    >
                                        Created
                                    </TableSortLabel>
                                </Tooltip>
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

                            return (<ListTableRow
                                item_id={item_id} item={item} isCurrent={isCurrent}
                                handleItemToggle={handleItemToggle}
                                sectionApi={sectionApi}
                                router={router}
                            />)
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

FileCollectionListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
