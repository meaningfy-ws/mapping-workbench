import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {Scrollbar} from 'src/components/scrollbar';

export const QueryResultTable = ({items}) => {

    const itemsReduce  = items.reduce((acc, item) => {
        acc[item.query_result.toString()]++
        return acc
    },{ true:0, false:0, error:0 })

    return (
        <Scrollbar>
            <Table sx={{minWidth: 1200}}>
                <TableHead>
                    <TableRow>
                        <TableCell >
                           Query Result
                        </TableCell>
                        <TableCell>
                            Number of
                        </TableCell>
                        <TableCell>
                            Ration
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(itemsReduce)?.map((item, key) => {
                        return (
                            <TableRow key={key}>
                                <TableCell>
                                        {item[0]}
                                </TableCell>
                                <TableCell>
                                    {item[1]}
                                </TableCell>
                                <TableCell>
                                    {`${item[1] ? (item[1]/items.length*100).toFixed(2) : 0}%`}
                                </TableCell>
                            </TableRow>

                        );
                    })}
                </TableBody>
            </Table>
        </Scrollbar>
    );
};