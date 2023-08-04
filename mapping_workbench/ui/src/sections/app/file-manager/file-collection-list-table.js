import {Fragment, useCallback, useState} from 'react';
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

import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import Tooltip from "@mui/material/Tooltip";
import {ListFileCollectionActions} from "src/components/app/list/list-file-collection-actions";
import {PropertyListItem} from 'src/components/property-list-item';
import {PropertyList} from "../../../components/property-list";

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
                            const statusColor = item.status === 'published' ? 'success' : 'info';

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
                                                            <PropertyList>
                                                                <PropertyListItem
                                                                    label="Description"
                                                                    value={item.description}
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
                rowsPerPageOptions={[5, 10, 25]}
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
