import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import TableSortLabel from "@mui/material/TableSortLabel";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";

export const resultColor = (result) => {
    switch (result.toLowerCase()) {
        case "error":
        case "invalid":
        case "violation":
            return "error"
        case "warning":
            return "warning"
        case "unverifiable":
        case "valid":
            return "success"
        default: return "info"
    }
}

export const ResultChip = ({label, color, clickable}) => {
    return(
        <Chip label={label}
              clickable={clickable}
              color={resultColor(color ?? label)}
              />
    )
}


export const SorterHeader = ({fieldName, title, desc, sort, onSort}) => {
    return <Tooltip enterDelay={300}
                   title="Sort"
           >
               <TableSortLabel
                    active={sort.column === fieldName}
                    direction={sort.direction}
                    onClick={() => onSort(fieldName, desc)}>
                    {title ?? fieldName}
                </TableSortLabel>
           </Tooltip>
}

export const sortItems = (items, sort) => {
        const sortColumn = sort.column
        if(!sortColumn) {
            return items
        } else {
            return items.sort((a,b) => {
                if (typeof a[sortColumn] === "string")
                    return sort.direction === "asc" ?
                        a[sortColumn]?.localeCompare(b[sortColumn]) :
                        b[sortColumn]?.localeCompare(a[sortColumn])
                else
                    return sort.direction === "asc" ?
                        a[sortColumn] - b[sortColumn] :
                        b[sortColumn] - a[sortColumn]
                })
        }
    }

export const TableSkeleton = ({lines = 5}) => {
    return new Array(lines).fill("").map((e, i) =>
                <Skeleton key={'line' + i}
                          height={50}/>)
}

export const TableNoData = () => {
    return <Stack justifyContent="center"
                       direction="row">
                    <Alert severity="info">No Data !</Alert>
                </Stack>
}

export const TableErrorFetching = () => {
    return <Stack justifyContent="center"
                       direction="row">
                    <Alert severity="error">Error on fetching data !</Alert>
                </Stack>
}

export const TableLoadWrapper = ({children, data, dataState, lines}) => {
    if (dataState.load) return <TableSkeleton lines={lines}/>
    if (dataState.error) return <TableErrorFetching/>
    if (data.length === 0) return <TableNoData/>
    return children
}