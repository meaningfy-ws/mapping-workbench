import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {legendClasses, PieChart} from '@mui/x-charts';

const ResultSummaryCoverageSparql = ({validationReport, handleChangeTab}) => {

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
        return {label: itemName, value: itemCount, itemPercent: (itemCount / itemsTotal) * 100 ?? 0, color: itemName==='valid' ? 'red' : 'blue'}
    })


    return <Paper sx={{p: 3, height: '100%'}}>
        <Stack direction='row'
               justifyContent='space-between'
               sx={{borderBottom: '2px solid #F2F4F7', pb: 3}}>
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
            <PieChart
                sx={{
                    [`& .${legendClasses.mark}`]: {
                        ry: 10,
                    },
                }}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: {vertical: 'bottom', horizontal: 'middle'},
                        itemMarkWidth: 12,
                        itemMarkHeight: 12
                    }
                }}
                series={[
                    {
                        data: itemsDisplay,
                        innerRadius: 60,
                        outerRadius: 100,
                        cy: 100,
                        cx: 180,
                    }
                ]}
                tooltip={{
                    trigger: 'item',
                    itemContent: (params) => {
                        const data = params.series.data[params.itemData.dataIndex]
                        return (
                            <Paper sx={{p: 1}}>
                                <Stack direction='column'>
                                    <strong>{data.itemPercent}%</strong>
                                    <span>{data.data}</span>
                                </Stack>
                            </Paper>
                        );
                    }
                }}
                width={368}
                height={348}/>
        </Stack>
    </Paper>
}

export default ResultSummaryCoverageSparql