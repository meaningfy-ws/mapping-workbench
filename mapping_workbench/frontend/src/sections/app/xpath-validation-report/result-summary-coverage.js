import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';
import {styled, useTheme} from '@mui/material/styles';

const ResultSummaryCoverage = ({item, validationReport, handleChangeTab}) => {

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
               justifyContent='space-between'
               sx={{borderBottom: '2px solid #F2F4F7', pb: 3}}>
            <Stack>
                <Typography color='#667085'>Result summary</Typography>
                <Typography fontSize='18'
                            fontWeight='bold'>Coverage (XPath)</Typography>
            </Stack>
            <Button endIcon={<OpenInNewIcon/>}
                    onClick={() => {
                        console.log('herre')
                        handleChangeTab('xpath')
                    }}>
                See more
            </Button>
        </Stack>
        <Stack sx={{mt: 3, mb: 'auto'}}>
            <Stack sx={{mb: 3}}>
                <Typography fontSize='18'
                            fontWeight='bold'>Mapping suite identifier</Typography>
                <Typography color='#667085'>{item.identifier}</Typography>
            </Stack>
            <Stack direction='row'
                   justifyContent='space-between'>
                <Stack>
                    <Typography color='#667085'>XPATHs covered</Typography>
                    <Typography sx={{mb: 2}}
                                fontWeight='bold'>{`${coveredReports.length}/${coveredReportPercent}%`}</Typography>
                </Stack>
                <Stack sx={{mb: 'auto'}}>
                    <Typography color='#667085'>XPATHs covered</Typography>
                    <Typography sx={{mb: 2}}
                                fontWeight='bold'>{`${notCoveredReports.length}/${notCoveredReportPercent}%`}</Typography>

                </Stack>
            </Stack>
            <BorderLinearProgress variant="determinate"
                                  color='success'
                                  value={notCoveredReportPercent}/>

        </Stack>
    </Paper>
}

export default ResultSummaryCoverage