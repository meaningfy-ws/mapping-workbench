import {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';

import {Scrollbar} from 'src/components/scrollbar';
import {ListItemActions} from 'src/components/app/list/list-item-actions';

import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';
import {mappingPackagesApi} from "../../../api/mapping-packages";
import TablePagination from "../../components/table-pagination-pages";
import timeTransformer from "../../../utils/time-transformer";
import {useGlobalState} from "../../../hooks/use-global-state";


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
    const {timeSetting} = useGlobalState()
    const handleItemToggle = itemId => {
        setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);
    }

    const [projectMappingPackages, setProjectMappingPackages] = useState([]);

    useEffect(() => {
        mappingPackagesApi.getProjectPackages()
            .then(res => setProjectMappingPackages(res))
            .catch(err => console.warn(err))
    }, [])

    const [projectMappingPackagesMap, setProjectMappingPackagesMap] = useState({});

    useEffect(() => {
        (() => {
            setProjectMappingPackagesMap(projectMappingPackages.reduce((a, b) => {
                a[b['id']] = b['title'];
                return a
            }, {}));
        })()
    }, [projectMappingPackages])

    return (
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
                            <TableCell width="25%">
                                URI
                            </TableCell>
                            <TableCell>
                                Package
                            </TableCell>
                            <TableCell align="left">
                                Created
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

                                        <TableCell width="25%">
                                            <Typography variant="subtitle2">
                                                {item.triple_map_uri}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.mapping_package_id && projectMappingPackagesMap[item.mapping_package_id]}
                                        </TableCell>
                                        <TableCell align="left">
                                            {timeTransformer(item.created_at, timeSetting)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <ListItemActions
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
                                                                    label="Content"
                                                                    value={item.triple_map_content}
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
