import Tooltip from "@mui/material/Tooltip";
import TableSortLabel from "@mui/material/TableSortLabel";

const SorterHeader = (props) => {
    const {fieldName, title, desc, sort, onSort, defaultSortDirection = 'asc', ...other} = props

    // If this column is sorted, use the current direction; otherwise, use the default
    const isActive = sort.column === fieldName;
    const direction = isActive ? sort.direction : defaultSortDirection;

    return <Tooltip enterDelay={300} title="Sort">
        <TableSortLabel
            active={isActive}
            direction={direction}
            onClick={() => onSort(fieldName, desc)}
            {...other}>
            {title ?? fieldName}
        </TableSortLabel>
    </Tooltip>
}

export default SorterHeader