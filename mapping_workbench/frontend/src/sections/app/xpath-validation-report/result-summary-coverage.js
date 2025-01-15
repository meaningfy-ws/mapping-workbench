import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';

const ResultSummaryCoverage = ({identifier, validationReport, handleChangeTab, load}) => {

    if (!validationReport) return null

    const {coveredReports, notCoveredReports} = validationReport?.reduce((acc, report) => {
        acc[report.is_covered ? "coveredReports" : "notCoveredReports"].push({sdk_element_xpath: report.sdk_element_xpath})
        return acc
    }, {coveredReports: [], notCoveredReports: []})

    const coveredReportPercent = (coveredReports.length / validationReport.length * 100).toFixed(2)
    const notCoveredReportPercent = (notCoveredReports.length / validationReport.length * 100).toFixed(2)

    const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
        height: 32,
        borderRadius: 16,
        [`&.${linearProgressClasses.root}`]: {
            backgroundColor: '#F9C74F',
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderBottomStartRadius: 16,
            borderTopStartRadius: 16,
            backgroundColor: '#90BE6D'
        },
    }));

    return <Paper sx={{p: 3, height: '100%'}}>
        <Stack direction='row'
               alignItems='center'
               justifyContent='space-between'>
            <Stack>
                <Typography fontSize='18'
                            fontWeight='bold'>Coverage (XPath)</Typography>
            </Stack>
            <Button
                    startIcon={<FileDownloadOutlinedIcon/>}
                    onClick={() => {
                        console.log('herre')
                        handleChangeTab('xpath')
                    }}>
                Export State
            </Button>
        </Stack>
        <Stack sx={{mt: 3, mb: 'auto'}}>
            <Stack sx={{mb: 3}}>
                <Typography fontSize='18'
                            fontWeight='bold'>Mapping suite identifier</Typography>
                <Typography color='#667085'>{identifier}</Typography>
            </Stack>
            <Stack direction='row'
                   justifyContent='space-between'>
                <Stack>
                    <Typography color='#667085'>XPATHs covered</Typography>
                    <Typography sx={{mb: 2}}
                                fontWeight='bold'>{`${coveredReports.length} / ${coveredReportPercent}%`}</Typography>
                </Stack>
                <Stack sx={{mb: 'auto'}}>
                    <Typography color='#667085'>XPATHs covered</Typography>
                    <Typography sx={{mb: 2}}
                                fontWeight='bold'>{`${notCoveredReports.length} / ${notCoveredReportPercent}%`}</Typography>

                </Stack>
            </Stack>
            <BorderLinearProgress variant={load ? "indeterminate" : "determinate"}
                                  color='success'
                                  value={notCoveredReportPercent}/>

        </Stack>
    </Paper>
}

export default ResultSummaryCoverage