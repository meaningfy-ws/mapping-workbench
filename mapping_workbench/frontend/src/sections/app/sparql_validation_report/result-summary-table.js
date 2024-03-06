import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {Scrollbar} from 'src/components/scrollbar';
import Typography from "@mui/material/Typography";

const ResultSummaryTable = ({items}) => {

    const {itemsTotal, ...itemsReduce} =
        items.map(item => item.result).reduce((acc, report) => {
            Object.keys(report).forEach(reportKey => {
                    acc[reportKey] = (acc[reportKey] ?? 0) + report[reportKey].count
                    acc["itemsTotal"] = (acc["itemsTotal"] ?? 0) + report[reportKey].count
                }
            )
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
                                            {item[0]}
                                    </TableCell>
                                    <TableCell>
                                        {item[1]}
                                    </TableCell>
                                    <TableCell>
                                        {`${item[1] ? (item[1]/itemsTotal*100).toFixed(2) : 0}%`}
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

export default ResultSummaryTable
