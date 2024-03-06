import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {Scrollbar} from 'src/components/scrollbar';
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {resultColor} from "./utils";

export const QueryResultTable = ({items}) => {

    const itemsReduce  = items.reduce((acc, item) => {
        acc[item.result] = (acc[item.result] ?? 0) + 1
        return acc
    },{})

    return (
        <>
            <Typography m={2}
                        variant="h4">
                    Results Summary
            </Typography>
            <Scrollbar>
                <Table sx={{minWidth: 1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell >
                                Result
                            </TableCell>
                            <TableCell>
                                Count
                            </TableCell>
                            <TableCell>
                                Ratio(%)
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(itemsReduce)?.map((item, key) => {
                            return (
                                <TableRow key={key}>
                                    <TableCell>
                                        <Chip label={item[0]}
                                              color={resultColor(item[0])}/>
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
        </>
    );
};