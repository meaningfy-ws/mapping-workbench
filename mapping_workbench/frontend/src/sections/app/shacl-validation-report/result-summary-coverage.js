import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExportButton from '../mapping-package/state/export-button';

import {StatePieChartBig} from '../mapping-package/state/state-pie-chart';
import {getValidationColor, getValidationReportShacl} from '../mapping-package/state/utils';

const Pie = ({data, handleExport}) => {
    return (<Paper>
        <Stack direction='column'
               sx={{py: 2, px: 3}}
               height={272}>
            <Stack direction='row'
                   alignItems='center'
                   justifyContent='space-between'>
                <Stack>
                    <Typography fontSize='18'
                                fontWeight='bold'>Coverage (SHACL)</Typography>
                </Stack>
                <ExportButton handleExport={handleExport}/>
            </Stack>
            <Stack alignItems='center'>
                <StatePieChartBig items={data}/>
            </Stack>
        </Stack>
    </Paper>)
}

export const ResultSummaryCoverage = ({validationReport, handleExport}) => {

    if (!validationReport) return null

    const {itemsTotal, ...itemsReduce} = getValidationReportShacl(validationReport)

    const itemsDisplay = Object.entries(itemsReduce)?.map(item => {
        const [itemName, itemCount] = item
        const percent = (itemCount / itemsTotal) * 100 ?? 0

        return {
            label: `${itemName[0].toUpperCase()}${itemName.slice(1)} (${percent.toFixed(2)}% - ${itemCount})`,
            value: itemCount,
            itemPercent: percent.toFixed(2),
            color: getValidationColor(itemName)
        }
    })

    return <Pie data={itemsDisplay}
                handleExport={handleExport}/>
}