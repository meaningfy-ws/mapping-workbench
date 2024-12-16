import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import {Scrollbar} from 'src/components/scrollbar';
import {TableNoData} from '../shacl-validation-report/utils';
import {ItemListCard} from './item-list-card';
import {ItemListRow} from './item-list-row';
import TablePagination from "../../components/table-pagination-pages";

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
            view = 'grid',
            onGetItems,
            onViewDetails
        } = props;


        const content = items.length ? view === 'grid' ?
                <Box sx={{p: 3}}>
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 3,
                            gridTemplateColumns: 'repeat(3, 1fr)'
                        }}
                    >
                        {items.map(item => (
                            <ItemListCard
                                key={item.filename}
                                item={item}
                                collection={collection}
                                sectionApi={sectionApi}
                                fileResourcesApi={fileResourcesApi}
                                onGetItems={onGetItems}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </Box>
                </Box>
                :
                // Negative margin is a fix for the box shadow. The virtual scrollbar cuts it.
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
                                    {items.map(item => (
                                        <ItemListRow
                                            key={item.filename}
                                            item={item}
                                            collection={collection}
                                            sectionApi={sectionApi}
                                            fileResourcesApi={fileResourcesApi}
                                            onGetItems={onGetItems}
                                            onViewDetails={onViewDetails}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Scrollbar>
                </Box>
            : <TableNoData/>

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
                <Card>
                    <Stack spacing={4}>
                        {content}
                    </Stack>
                </Card>
            </TablePagination>
        );
    }
;

ItemList.propTypes = {
    items: PropTypes.array,
    collection: PropTypes.string,
    sectionApi: PropTypes.object,
    count: PropTypes.number,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    view: PropTypes.oneOf(['grid', 'list'])
};
