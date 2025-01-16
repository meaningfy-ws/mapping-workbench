import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {StatePieChartBig} from '../mapping-package/state/state-pie-chart';
import getValidationColor from '../mapping-package/state/validation-color';

const ResultSummaryQuery = ({validationReport}) => {
    const itemsReduce = validationReport.reduce((acc, item) => {
        acc[item.result] = (acc[item.result] ?? 0) + 1
        return acc
    }, {valid: 0, unverifiable: 0, warning: 0, invalid: 0, error: 0, unknown: 0})

    const itemsDisplay = Object.entries(itemsReduce)?.map(item => {
        const [itemName, itemCount] = item
        return {
            label: itemName,
            value: itemCount,
            itemPercent: (itemCount / validationReport.length) * 100 ?? 0,
            color: getValidationColor(itemName)
        }
    })

    return (<Paper>
        <Stack direction='column'
               sx={{px: 3, py: 2}}
               height={272}>
            <Stack direction='row'
                   alignItems='center'
                   justifyContent='space-between'>
                <Stack>
                    <Typography fontSize='18'
                                fontWeight='bold'>Coverage (XPath)</Typography>
                </Stack>
                <Button
                    startIcon={<FileDownloadOutlinedIcon/>}
                    onClick={() => handleChangeTab('xpath')}>
                    Export State
                </Button>
            </Stack>
            <Stack alignItems='center'>
                <StatePieChartBig items={itemsDisplay}/>
            </Stack>
        </Stack>
    </Paper>)
}

export default ResultSummaryQuery