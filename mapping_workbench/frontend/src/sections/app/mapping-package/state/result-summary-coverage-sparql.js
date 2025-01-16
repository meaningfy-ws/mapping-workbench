import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {StatePieChart} from './state-pie-chart';
import getValidationColor from './validation-color';

const ResultSummaryCoverageSparql = ({validationReport, handleChangeTab}) => {
    const theme = useTheme()
    if (!validationReport) return null

    const {itemsTotal, ...itemsReduce} =
        validationReport.map(item => item.result).reduce((acc, report) => {
            Object.keys(report).forEach(reportKey => {
                    acc[reportKey] = (acc[reportKey] ?? 0) + report[reportKey].count
                    acc["itemsTotal"] = (acc["itemsTotal"] ?? 0) + report[reportKey].count
                }
            )
            return acc
        }, {valid: 0, unverifiable: 0, warning: 0, invalid: 0, error: 0, unknown: 0})

    const itemsDisplay = Object.entries(itemsReduce)?.map(item => {
        const [itemName, itemCount] = item
        return {
            label: itemName,
            value: itemCount,
            itemPercent: (itemCount / itemsTotal) * 100 ?? 0,
            color: getValidationColor(itemName)
        }
    })

    return <Paper sx={{p: 3, height: '100%'}}>
        <Stack direction='row'
               justifyContent='space-between'
               sx={{borderBottom: `2px solid ${theme.palette.divider}`, pb: 3}}>
            <Stack>
                <Typography color='#667085'>Result summary</Typography>
                <Typography fontSize='18'
                            fontWeight='bold'>Coverage (SPARQL)</Typography>
            </Stack>
            <Button endIcon={<OpenInNewIcon/>}
                    onClick={() => handleChangeTab('sparql')}>
                See more
            </Button>
        </Stack>
        <Stack sx={{mt: 3, mb: 2}}
               alignItems='center'>
            <StatePieChart items={itemsDisplay}/>
        </Stack>
    </Paper>
}

export default ResultSummaryCoverageSparql