import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {PieChart} from '@mui/x-charts';

const ResultSummaryCoverageShacl= ({validationReport}) => {

    console.log('shacl',validationReport)
    if (!validationReport) return null

    const {itemsTotal, ...itemsReduce} =
        validationReport.map(item => item.result).reduce((acc, report) => {
            Object.keys(report).forEach(reportKey => {
                    acc[reportKey] = (acc[reportKey] ?? 0) + report[reportKey].count
                    acc["itemsTotal"] = (acc["itemsTotal"] ?? 0) + report[reportKey].count
                }
            )
            return acc
        },{info:0, valid:0, violation:0, warning:0})

    const itemsDisplay = Object.entries(itemsReduce)?.map(item => {
        const [itemName, itemCount] = item
        return {label: itemName, value: itemCount, itemPercent: (itemCount / itemsTotal) * 100 ?? 0}
    })

    return <Paper sx={{p: 3}}>
        <Stack direction='row'
               justifyContent='space-between'
               sx={{borderBottom: '2px solid #F2F4F7', pb: 3}}>
            <Stack>
                <Typography color='#667085'>Result summary</Typography>
                <Typography fontSize='18'
                            fontWeight='bold'>Coverage (SHALC)</Typography>
            </Stack>
            <Button endIcon={<OpenInNewIcon/>}>See more</Button>
        </Stack>
        <Stack sx={{mt: 3, mb: 2}}>
            <PieChart series={[
                {
                    data: itemsDisplay,
                    innerRadius: 60
                }
            ]}
                      width={368}
                      height={348}/>
        </Stack>
    </Paper>
}

export default ResultSummaryCoverageShacl