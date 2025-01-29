import {Fragment, useState} from 'react';
import PropTypes from 'prop-types';

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import {useProjects} from "src/hooks/use-projects";
import {Scrollbar} from 'src/components/scrollbar';
import timeTransformer from "src/utils/time-transformer";
import {useGlobalState} from "src/hooks/use-global-state";
import {PropertyList} from 'src/components/property-list';
import {SeverityPill} from "src/components/severity-pill";
import {PropertyListItem} from 'src/components/property-list-item';
import {ChevronButton} from 'src/sections/components/chevron-button';
import {ListItemActions} from 'src/components/app/list/list-item-actions';
import {MenuActionButton, MenuActions} from 'src/components/menu-actions';
import TablePagination from "src/sections/components/table-pagination";
import TableSorterHeader from "src/sections/components/table-sorter-header";
import {ForListItemAction} from 'src/contexts/app/section/for-list-item-action';


export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => {
        },
        onSort = () => {
        },
        sort,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi
    } = props;

    const {timeSetting} = useGlobalState()

    const [currentItem, setCurrentItem] = useState(null);
    const projectStore = useProjects()

    const handleItemToggle = itemId => setCurrentItem(prevItemId => prevItemId === itemId ? null : itemId);

    const SorterHeader = (props) => {
        const direction = props.fieldName === sort.column && sort.direction === 'desc' ? 'asc' : 'desc';
        return (
            <TableSorterHeader sort={{direction, column: sort.column}}
                               onSort={onSort}
                               {...props}
            />
        )
    }
    return (
        <TablePagination component="div"
                         count={count}
                         onPageChange={onPageChange}
                         onRowsPerPageChange={onRowsPerPageChange}
                         page={page}
                         rowsPerPage={rowsPerPage}
                         rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
                         showFirstButton
                         showLastButton
        >
            <Paper>
                <Scrollbar>
                    <Table sx={{minWidth: 1200}}>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell width="25%">
                                    <SorterHeader fieldName="title"/>
                                </TableCell>
                                <TableCell>
                                    <SorterHeader fieldName="description"/>
                                </TableCell>
                                <TableCell>
                                    <SorterHeader fieldName="version"/>
                                </TableCell>
                                <TableCell align="left">
                                    <SorterHeader fieldName="created_at"
                                                  title="created"/>
                                </TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map(item => {
                                const item_id = item._id;
                                const isCurrent = item_id === currentItem;
                                const isSessionProject = item_id === projectStore.sessionProject
                                const statusColor = isSessionProject ? 'success' : 'primary';

                                return (
                                    <Fragment key={item_id}>
                                        <TableRow hover>
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
                                                <ChevronButton onClick={() => handleItemToggle(item_id)}
                                                               isCurrent={isCurrent}/>
                                            </TableCell>
                                            <TableCell
                                                width="25%"
                                            >
                                                <Typography
                                                    variant="subtitle3"
                                                >
                                                    {isSessionProject
                                                        ? <SeverityPill color={statusColor}>
                                                            <b>{item.title}</b>
                                                        </SeverityPill>
                                                        : item.title}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {item.description}
                                            </TableCell>
                                            <TableCell>
                                                {item.version}
                                            </TableCell>
                                            <TableCell align="left">
                                                {timeTransformer(item.created_at, timeSetting)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <MenuActions>
                                                    <MenuActionButton
                                                        id="select_button"
                                                        onClick={() => projectStore.handleSessionProjectChange(item_id)}
                                                        title='Select'
                                                        icon={<CheckOutlinedIcon/>}
                                                    />
                                                    <MenuActionButton
                                                        id="cleanup_button"
                                                        onClick={() => projectStore.handleProjectCleanup(item_id)}
                                                        icon={<CleaningServicesOutlinedIcon/>}
                                                        title='Cleanup'
                                                    />
                                                    <ListItemActions
                                                        onDeleteAction={() => projectStore.handleDeleteProject(item_id)}
                                                        itemctx={new ForListItemAction(item_id, sectionApi)}/>
                                                </MenuActions>
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
                                                        <Grid
                                                            container
                                                            spacing={3}
                                                        >
                                                            <Grid
                                                                item
                                                                md={12}
                                                                xs={12}
                                                            >

                                                                <Grid
                                                                    container
                                                                    spacing={3}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        md={6}
                                                                        xs={12}
                                                                    >
                                                                        <Typography sx={{paddingLeft: "24px"}}
                                                                                    variant="h6">
                                                                            Source Schema
                                                                        </Typography>
                                                                        <Divider sx={{my: 2}}/>
                                                                        {item.source_schema && <PropertyList>
                                                                            <PropertyListItem
                                                                                divider
                                                                                label="Title"
                                                                                value={item.source_schema.title}
                                                                            />
                                                                            <PropertyListItem
                                                                                divider
                                                                                label="Description"
                                                                                value={item.source_schema.description}
                                                                            />
                                                                            <PropertyListItem
                                                                                divider
                                                                                label="Version"
                                                                                value={item.source_schema.version}
                                                                            />
                                                                            <PropertyListItem
                                                                                divider
                                                                                label="Type"
                                                                                value={item.source_schema.type}
                                                                            />
                                                                        </PropertyList>}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        md={6}
                                                                        xs={12}
                                                                    >
                                                                        <Typography sx={{paddingLeft: "24px"}}
                                                                                    variant="h6">
                                                                            Target Ontology
                                                                        </Typography>
                                                                        <Divider sx={{my: 2}}/>

                                                                        {item.target_ontology && <PropertyList>
                                                                            <PropertyListItem
                                                                                divider
                                                                                label="Title"
                                                                                value={item.target_ontology.title}
                                                                            />
                                                                            <PropertyListItem
                                                                                divider
                                                                                label="Description"
                                                                                value={item.target_ontology.description}
                                                                            />
                                                                            <PropertyListItem
                                                                                divider
                                                                                label="Version"
                                                                                value={item.target_ontology.version}
                                                                            />
                                                                            <PropertyListItem
                                                                                divider
                                                                                label="URI"
                                                                                value={item.target_ontology.uri}
                                                                            />
                                                                        </PropertyList>}

                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        md={6}
                                                                        xs={12}
                                                                    >
                                                                    </Grid>
                                                                </Grid>
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
            </Paper>
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
