import Tooltip from "@mui/material/Tooltip";
import TableSortLabel from "@mui/material/TableSortLabel";

const SorterHeader = ({fieldName, title, desc, sort, onSort}) => {
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

export default SorterHeader