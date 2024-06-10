import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {Scrollbar} from 'src/components/scrollbar';
import Button from "@mui/material/Button";


export const ListTable = (props) => {
    const {
        items = [],
        onEdit,
        onDelete,
        disabled
    } = props;


    return (
        <Scrollbar>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Id
                        </TableCell>
                        <TableCell>
                            Type
                        </TableCell>
                         <TableCell>
                            Description
                        </TableCell>
                        <TableCell align="right">
                            Action
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => {
                        const item_id = item["@id"];
                        const item_type = item["@type"]
                        const item_description= item["schema:description"]

                        return (
                                <TableRow
                                    hover
                                    key={item_id}
                                >
                                    <TableCell>
                                        {item_id}
                                    </TableCell>
                                     <TableCell>
                                        {item_type}
                                    </TableCell>
                                    <TableCell>
                                        {item_description}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button type='link'
                                                color="success"
                                                disabled={disabled}
                                                onClick={() => onEdit(item)}>Edit</Button>
                                        <Button type='link'
                                                color="error"
                                                disabled={disabled}
                                                onClick={() => onDelete(item)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Scrollbar>
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
