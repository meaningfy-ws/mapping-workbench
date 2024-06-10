import {useCallback, useState} from 'react';
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
        onEdit
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
                            Name
                        </TableCell>
                        <TableCell align="right">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => {
                        const item_id = item["@id"];

                        return (
                                <TableRow
                                    hover
                                    key={item_id}
                                >
                                    <TableCell>
                                        {item_id}
                                    </TableCell>
                                    <TableCell>
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button type='link'
                                                color="success"
                                                onClick={() => onEdit(item)}>Edit</Button>
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
