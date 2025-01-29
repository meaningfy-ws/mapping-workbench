import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ExportButton from '../mapping-package/state/export-button';
import {LineProgressDouble} from '../mapping-package/state/state-line-progress';

const ResultSummaryCoverage = ({identifier, validationReport, handleExport, load}) => {

    if (!validationReport) return null

    const {coveredReports, notCoveredReports} = validationReport?.reduce((acc, report) => {
        acc[report.is_covered ? "coveredReports" : "notCoveredReports"].push({sdk_element_xpath: report.sdk_element_xpath})
        return acc
    }, {coveredReports: [], notCoveredReports: []})

    const coveredReportPercent = (coveredReports.length / validationReport.length * 100).toFixed(2)
    const notCoveredReportPercent = (notCoveredReports.length / validationReport.length * 100).toFixed(2)


    return <Paper sx={{p: 3}}>
        <Stack direction='row'
               alignItems='center'
               justifyContent='space-between'>
            <Stack>
                <Typography variant='secondary'>Result summary</Typography>
                <Typography fontSize='18'
                            fontWeight='bold'>Coverage (XPath)</Typography>
            </Stack>
            <ExportButton handleExport={handleExport}/>
        </Stack>
        <Stack sx={{mt: 3}}>
            <Stack sx={{mb: 3}}>
                <Typography fontSize='18'
                            fontWeight='bold'>Mapping suite identifier</Typography>
                <Typography variant='secondary'>{identifier}</Typography>
            </Stack>
            <Stack direction='row'
                   justifyContent='space-between'>
                <Stack>
                    <Typography variant='secondary'>XPATHs covered</Typography>
                    <Typography sx={{mb: 2}}
                                fontWeight='bold'>{`${coveredReports.length} / ${coveredReportPercent}%`}</Typography>
                </Stack>
                <Stack sx={{mb: 'auto'}}>
                    <Typography variant='secondary'>XPATHs not covered</Typography>
                    <Typography sx={{mb: 2}}
                                fontWeight='bold'>{`${notCoveredReports.length} / ${notCoveredReportPercent}%`}</Typography>

                </Stack>
            </Stack>
            <LineProgressDouble value={coveredReportPercent}
                                load={load}
                                color='valid'
                                endColor='warning'/>
        </Stack>
    </Paper>
}

export default ResultSummaryCoverage