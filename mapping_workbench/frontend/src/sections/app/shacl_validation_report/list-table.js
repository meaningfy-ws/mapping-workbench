
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from "@mui/material/Tooltip";

import PropTypes from 'prop-types';
import {Scrollbar} from 'src/components/scrollbar';
import {useRouter} from "../../../hooks/use-router";

export const ListTable = (props) => {
    const {
        count = 0,
        items = [],
        onPageChange,
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0,
        sectionApi,
        onSort,
        sort
    } = props;

    const router = useRouter();
    if (!router.isReady) return;

    const SorterHeader = ({fieldName, title}) => {
        return <Tooltip enterDelay={300}
                        title="Sort"
                >
                    <TableSortLabel
                        active={sort.column === fieldName}
                        direction={sort.direction}
                        onClick={() => onSort(fieldName)}>
                        {title ?? fieldName}
                    </TableSortLabel>
                </Tooltip>
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
            />
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell width="25%">
                                <SorterHeader fieldName="focusNode"/>
                            </TableCell>
                            <TableCell>
                                <SorterHeader fieldName="resultPath"/>
                            </TableCell>
                            <TableCell>
                               <SorterHeader fieldName="resultSeverity"/>
                            </TableCell>
                            <TableCell align="left">
                                <SorterHeader fieldName="sourceConstraintComponent"/>
                            </TableCell>
                            <TableCell align="center">
                                <SorterHeader fieldName="message"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, key)=> {
                            return (
                                <TableRow key={key}>
                                    <TableCell width="25%">
                                        <Typography variant="subtitle3">
                                            {item.focusNode}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {item.resultPath}
                                    </TableCell>
                                    <TableCell>
                                        {item.resultSeverity}
                                    </TableCell>
                                    <TableCell align="left">
                                        {item.sourceConstraintComponent}
                                    </TableCell>
                                    <TableCell align="left">
                                        {item.message}
                                    </TableCell>
                                </TableRow>
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
