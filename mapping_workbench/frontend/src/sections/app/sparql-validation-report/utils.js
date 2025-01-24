import {Box} from "@mui/system";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from '@mui/material/FormControl';
import TableSortLabel from "@mui/material/TableSortLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import validationColor from '../mapping-package/state/validation-color';

export const capitalize = (value) => `${value[0].toUpperCase()}${value.slice(1)}`

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

export const ResultChip = ({label, color, fontColor, onClick, clickable, children}) => {
    const hover = onClick ?? clickable ? {'&:hover': {filter: 'brightness(85%)'}, cursor: 'pointer'} : {}
    return (
        <Box sx={{textAlign:'center',px: 1, py: .5, borderRadius: 12, backgroundColor: color, color: fontColor, ...hover}}
             onClick={onClick}
        >
            {label ?? children}
        </Box>
    )
}

export const ResultFilter = ({currentState, onStateChange, values}) => {

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
                                <ResultChip color={validationColor(label)}
                                            fontColor='#fff'
                                            clickable
                                            label={capitalize(label)}/>
                            </Typography>

                    </Box>
                )}
                value={value ?? label.toLowerCase()}
            />)
    }

    return (
        <FormControl sx={{p: 2}}>
            <Stack
                direction='row'
                component={RadioGroup}
                name="terms_validity"
                onChange={onStateChange}
            >
                <FilterValue label="all"
                             value=""
                             currentState={currentState}/>
                {values.map(value =>
                    <FilterValue key={value.value}
                                 label={value.label ?? value.value}
                                 currentState={currentState}/>)}
            </Stack>
        </FormControl>
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