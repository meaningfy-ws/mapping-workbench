import {useState} from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from "@mui/material/Chip";

import {Scrollbar} from 'src/components/scrollbar';
import {resultColor, SorterHeader as UtilsSortHeader, sortItems} from "./utils";

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
        },{info:0, valid:0, violation:0, warning:0})

    const itemsDisplay = Object.entries(itemsReduce)?.map(item => {
        const [itemName, itemCount] = item
        return {itemName, itemCount, itemPercent: (itemCount/itemsTotal) * 100 ?? 0 }
    })

    const sortedItems = sortItems(itemsDisplay, sort)

    const SorterHeader = ({title, fieldName}) => <UtilsSortHeader title={title}
                                                                  fieldName={fieldName}
                                                                  sort={sort}
                                                                  onSort={handleSort}/>

    return (
        <Scrollbar>
            <Table sx={{minWidth: 1200}}>
                <TableHead>
                    <TableRow>
                        <TableCell >
                            <SorterHeader title="Result"
                                          fieldName="itemName"
                            />
                        </TableCell>
                        <TableCell>
                            <SorterHeader title="Count"
                                          fieldName="itemCount"
                            />
                        </TableCell>
                        <TableCell>
                            <SorterHeader title="Ratio(%)"
                                          fieldName="itemPercent"
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
