import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export const TableLoadWrapper = ({children, data, dataState, lines}) => {
    if (dataState.load) return <TableSkeleton lines={lines}/>
    if (dataState.error) return <TableErrorFetching/>
    if (!data.length) return <TableNoData/>
    return children
}


export const TableSkeleton = ({lines = 5}) => {
    return <div>
        {new Array(lines).fill("").map((e, i) =>
            <Skeleton key={'line' + i}
                      height={50}/>)}
        </div>
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