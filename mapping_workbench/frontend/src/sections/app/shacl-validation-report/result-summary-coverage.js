import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ExportButton from '../mapping-package/state/export-button';

import {StatePieChartBig} from '../mapping-package/state/state-pie-chart';
import getValidationColor from '../mapping-package/state/validation-color';

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

    const {itemsTotal, ...itemsReduce} =
        validationReport.map(item => item.result).reduce((acc, report) => {
            Object.keys(report).forEach(reportKey => {
                    acc[reportKey] = (acc[reportKey] ?? 0) + report[reportKey].count
                    acc["itemsTotal"] = (acc["itemsTotal"] ?? 0) + report[reportKey].count
                }
            )
            return acc
        }, {info: 0, valid: 0, violation: 0, warning: 0})

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

export const ResultSummaryQuery = ({validationReport}) => {
    const itemsReduce = validationReport.reduce((acc, item) => {
        acc[item.result] = (acc[item.result] ?? 0) + 1
        return acc
    }, {valid: 0, unverifiable: 0, warning: 0, invalid: 0, error: 0, unknown: 0})

    const itemsDisplay = Object.entries(itemsReduce)?.map(item => {
        const [itemName, itemCount] = item
        const percent = (itemCount / validationReport.length) * 100 ?? 0
        return {
            label: `${itemName[0].toUpperCase()}${itemName.slice(1)} (${percent.toFixed(2)}% - ${itemCount})`,
            value: itemCount,
            itemPercent: percent.toFixed(2),
            color: getValidationColor(itemName)
        }
    })

    return <Pie data={itemsDisplay}/>
}
