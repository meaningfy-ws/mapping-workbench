import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';

import {Scrollbar} from 'src/components/scrollbar';

import {ItemListCard} from './item-list-card';
import {ItemListRow} from './item-list-row';

export const ItemList = (props) => {
    const {
        count = 0,
        items = [],
        collection,
        sectionApi,
        fileResourcesApi,
        onPageChange = () => {
        },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        view = 'grid'
    } = props;

    let content;    

    if (view === 'grid') {
        content = (
            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: 'repeat(3, 1fr)'
                }}
            >
                {items.map((item) => (
                    <ItemListCard
                        key={item._id}
                        item={item}
                        collection={collection}
                        sectionApi={sectionApi}
                        fileResourcesApi={fileResourcesApi}
                    />
                ))}
            </Box>
        );
    } else {
        // Negative margin is a fix for the box shadow. The virtual scrollbar cuts it.
        content = (
            <Box sx={{m: -3}}>
                <Scrollbar>
                    <Box sx={{p: 3}}>
                        <Table
                            sx={{
                                minWidth: 600,
                                borderCollapse: 'separate',
                                borderSpacing: '0 8px'
                            }}
                        >
                            <TableBody>
                                {items.map((item) => (
                                    <ItemListRow
                                        key={item._id}
                                        item={item}
                                        collection={collection}
                                        sectionApi={sectionApi}
                                        fileResourcesApi={fileResourcesApi}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Scrollbar>
            </Box>
        );
    }

    return (
        <Stack spacing={4}>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />
            {content}
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={sectionApi.DEFAULT_ROWS_PER_PAGE_SELECTION}
            />
        </Stack>
    );
};

ItemList.propTypes = {
    items: PropTypes.array,
    collection: PropTypes.object,
    sectionApi: PropTypes.object,
    count: PropTypes.number,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    view: PropTypes.oneOf(['grid', 'list'])
};
