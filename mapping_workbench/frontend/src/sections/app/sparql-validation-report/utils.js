import {Box} from "@mui/system";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import {getValidationColor} from '../mapping-package/state/utils';
import {ValueChip} from '../xpath-validation-report/utils';

export const capitalize = (value) => `${value[0].toUpperCase()}${value.slice(1)}`

export const ResultChip = ({label, color, fontColor, onClick, clickable, children}) => {
    const hover = onClick ?? clickable ? {'&:hover': {filter: 'brightness(85%)'}, cursor: 'pointer'} : {}
    return (
        <Box sx={{
            textAlign: 'center',
            px: 1,
            py: .5,
            borderRadius: 12,
            backgroundColor: color,
            color: fontColor, ...hover
        }}
             onClick={onClick}
        >
            {label ?? children}
        </Box>
    )
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