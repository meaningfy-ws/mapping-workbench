import {useState} from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from "@mui/material/Chip";

import {Scrollbar} from 'src/components/scrollbar';
import {resultColor, SorterHeader, sortItems} from "./utils";

const ResultSummaryTable = ({items}) => {
    const[sort,setSort] = useState({column:"", direction:"desc"})

    const handleSort = (column) => {
        setSort(prevState=> ({ column,
                direction: prevState.column === column && prevState.direction === "asc" ? "desc" : "asc" }))
    }

    const {itemsTotal, ...itemsReduce} =
        items.map(item => item.result).reduce((acc, report) => {
            Object.keys(report).forEach(reportKey => {
                    acc[reportKey] = (acc[reportKey] ?? 0) + report[reportKey].count
                    acc["itemsTotal"] = (acc["itemsTotal"] ?? 0) + report[reportKey].count
                }
            )
            return acc
        },{valid:0,unverifiable:0,warning:0,invalid:0,error:0,unknown:0})

    const itemsDisplay = Object.entries(itemsReduce)?.map(item => {
        const [itemName, itemCount] = item
        return {itemName, itemCount, itemPercent: (itemCount/itemsTotal) * 100 ?? 0 }
    })

    const sortedItems = sortItems(itemsDisplay, sort)

    return (
        <Scrollbar>
            <Table sx={{minWidth: 1200}}>
                <TableHead>
                    <TableRow>
                        <TableCell >
                            <SorterHeader
                                        title="Result"
                                        fieldName="itemName"
                                        sort={sort}
                                        onSort={handleSort}
                            />
                        </TableCell>
                        <TableCell>
                            <SorterHeader
                                        title="Count"
                                        fieldName="itemCount"
                                        sort={sort}
                                        onSort={handleSort}
                            />
                        </TableCell>
                        <TableCell>
                            <SorterHeader
                                        title="Ratio(%)"
                                        fieldName="itemPercent"
                                        sort={sort}
                                        onSort={handleSort}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedItems?.map((item, key) => {
                        return (
                            <TableRow key={key}>
                                <TableCell>
                                    <Chip label={item.itemName}
                                          color={resultColor(item.itemName)}/>
                                </TableCell>
                                <TableCell>
                                    {item.itemCount}
                                </TableCell>
                                <TableCell>
                                    {`${item.itemPercent.toFixed(2)}%`}
                                </TableCell>
                            </TableRow>

                        );
                    })}
                </TableBody>
            </Table>
        </Scrollbar>
    );
};

export default ResultSummaryTable
