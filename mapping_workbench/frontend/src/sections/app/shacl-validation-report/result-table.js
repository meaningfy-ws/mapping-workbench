import {useState} from "react";

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import {Scrollbar} from 'src/components/scrollbar';
import {SorterHeader as UtilsSortHeader, sortItems} from "./utils";

export const ResultTable = (props) => {
    const {items} = props;
    const[sort,setSort] = useState({column:"", direction:"desc"})

    const handleSort = (column) => {
        setSort(prevState=> ({ column,
                direction: prevState.column === column && prevState.direction === "asc" ? "desc" : "asc" }))
    }

    const sortedItems = sortItems(items, sort)

    const SorterHeader = ({title, fieldName}) => <UtilsSortHeader title={title}
                                                                  fieldName={fieldName}
                                                                  sort={sort}
                                                                  onSort={handleSort}/>

    return (
        <Scrollbar>
            <Table sx={{minWidth: 1200}}>
                <TableHead>
                    <TableRow>
                        <TableCell width="25%">
                            <SorterHeader fieldName="title"/>
                        </TableCell>
                        <TableCell>
                            <SorterHeader fieldName="conforms"/>
                        </TableCell>
                        <TableCell>
                           <SorterHeader fieldName="error"/>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedItems?.map((item, key)=> {
                        return (
                            <TableRow key={key}>
                                <TableCell width="25%">
                                    <Typography variant="subtitle3">
                                        {item.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {item.conforms.toString()}
                                </TableCell>
                                <TableCell>
                                    {item.error}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Scrollbar>
    );
};

ResultTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number
};
