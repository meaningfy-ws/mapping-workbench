import {useState} from "react";

import Chip from "@mui/material/Chip";
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';

import {Scrollbar} from 'src/components/scrollbar';
import {resultColor, SorterHeader, sortItems} from "./utils";

export const QueryResultTable = ({items}) => {
    const[sort,setSort] = useState({column:"", direction: "desc"})

    const handleSort = (column) => {
        setSort(prevState=> ({ column,
                direction: prevState.column === column && prevState.direction === "asc" ? "desc" : "asc" }))
    }

    const itemsReduce  = items.reduce((acc, item) => {
        acc[item.result] = (acc[item.result] ?? 0) + 1
        return acc
    },{valid:0, unverifiable:0, warning:0, invalid:0, error:0, unknown:0})

    const itemsDisplay = Object.entries(itemsReduce)?.map(item => {
        const [itemName, itemCount] = item
        return {itemName, itemCount, itemPercent: (itemCount/items.length) * 100 ?? 0 }
    })

    const sortedItems = sortItems(itemsDisplay, sort)

    return (
        <Scrollbar>
            <Table sx={{minWidth: 1200}}>
                <TableHead>
                    <TableRow>
                        <TableCell >
                            <SorterHeader title="Result"
                                          fieldName="itemName"
                                          sort={sort}
                                          onSort={handleSort}
                            />
                        </TableCell>
                        <TableCell>
                            <SorterHeader title="Count"
                                          fieldName="itemCount"
                                          sort={sort}
                                          onSort={handleSort}
                            />
                        </TableCell>
                        <TableCell>
                            <SorterHeader title="Ratio(%)"
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