import {Box} from "@mui/system";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import TableSortLabel from "@mui/material/TableSortLabel";
import FormControlLabel from "@mui/material/FormControlLabel";

export const resultColor = (result) => {
    switch (result.toLowerCase()) {
        case "error":
        case "invalid":
            return "error"
        case "warning":
            return "warning"
        case "unverifiable":
        case "valid":
            return "success"
        default:
            return "info"
    }
}

export const ResultChip = ({label, color, fontColor, onClick}) => {
    const hover = onClick ? {'&:hover': {filter: 'brightness(85%)'}, cursor: 'pointer'} : {}
    return (
        <Box sx={{px: 1, py: .5, borderRadius: 12, backgroundColor: color, color: fontColor, ...hover}}
             onClick={onClick}
        >
            {label ?? children}
        </Box>
    )
}

export const ResultFilter = ({currentState, onStateChange}) => {
    const reportValues = ["valid", "unverifiable", "warning", "invalid", "error", "unknown"]

    const FilterValue = ({label, value, currentState}) => {
        return (
            <FormControlLabel
                control={<Radio/>}
                checked={currentState === (value ?? label.toLowerCase())}
                label={(
                    <Box sx={{ml: 0, mr: 1}}>
                        <Typography
                            variant="subtitle2"
                        >
                            <ResultChip clickable
                                        label={label}/>
                        </Typography>
                    </Box>
                )}
                value={value ?? label.toLowerCase()}
            />)
    }

    return (
        <Box sx={{p: 2.5, display: 'flex'}}
             direction="row">
            <Stack
                component={RadioGroup}
                name="terms_validity"
                spacing={3}
                onChange={onStateChange}
            >
                <Paper
                    sx={{
                        alignItems: 'flex-start',
                        display: 'flex',
                        p: 2
                    }}
                    variant="outlined"
                >
                    <Box sx={{mr: 2, mt: 1}}>
                        <b>Filter Results:</b>
                    </Box>
                    <FilterValue label="all"
                                 value=""
                                 currentState={currentState}/>
                    {reportValues.map(value =>
                        <FilterValue key={value}
                                     label={value}
                                     currentState={currentState}/>)}


                </Paper>
            </Stack>
        </Box>
    )
}

export const SorterHeader = ({fieldName, title, sort, onSort}) => {
    return <Tooltip enterDelay={300}
                    title="Sort"
    >
        <TableSortLabel
            active={sort.column === fieldName}
            direction={sort.direction}
            onClick={() => onSort(fieldName)}>
            {title ?? fieldName}
        </TableSortLabel>
    </Tooltip>
}

export const sortItems = (items, sort) => {
    const sortColumn = sort.column
    if (!sortColumn) {
        return items
    } else {
        return items.sort((a, b) => {
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