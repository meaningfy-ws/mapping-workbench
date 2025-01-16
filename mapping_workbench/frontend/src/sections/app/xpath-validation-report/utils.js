import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import {useTheme} from '@mui/material/styles';

export const CoverageFilter = ({value, onValueChange, values}) => {
    return (
        <FormControl sx={{p: 2}}>
            <Stack direction='row'
                   alignItems='center'
                   gap={2}>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                >
                    {values.map(e => <FormControlLabel key={e.label}
                                                       value={e.value}
                                                       control={<Radio/>}
                                                       label={<Stack gap={1}
                                                                     direction='row'
                                                                     alignItems='center'>
                                                           {e.label}
                                                           <ValueChip color={e.color}>{e.count}</ValueChip>
                                                       </Stack>}/>
                    )}
                </RadioGroup>

            </Stack>
        </FormControl>
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


export const ValueChip = ({children, value, color}) => {
    const theme = useTheme()
    const themeColor = theme.palette?.[color] ?? {}
    return (
        <Box sx={{
            px: 1.4,
            py: 0.3,
            backgroundColor: themeColor.alpha12,
            color: themeColor.main,
            borderRadius: 5
        }}>{value ?? children}</Box>
    )
}