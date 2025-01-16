import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";

import ResultSummaryCoverageShacl from './result-summary-coverage-shacl';
import ResultSummaryCoverageSparql from './result-summary-coverage-sparql';
import ResultSummaryCoverageXpath from './result-summary-coverage-xpath';

const StateDetails = ({item, sid, handleChangeTab, validationReport}) => {

    return (
        <Grid container
              spacing={3}>
            <Grid xs={12}>
                <Paper sx={{p: 3}}>
                    <Stack gap={3}>
                        <Typography fontWeight='bold'>Conceptual mapping for {item.title}</Typography>
                        <Stack direction={{xs: 'column', md: 'row'}}
                               gap={3}>
                            <Stack sx={{
                                border: '1px solid #E4E7EC',
                                backgroundColor: '#FCFCFD',
                                borderRadius: '5px',
                                py: '12px',
                                px: '16px'
                            }}>
                                <Typography sx={{color: '#667085', mb: '10px'}}>{item._id}</Typography>
                                <Typography>{item.title}</Typography>
                            </Stack>
                            <Stack sx={{
                                border: '1px solid #E4E7EC',
                                backgroundColor: '#FCFCFD',
                                borderRadius: '5px',
                                py: '12px',
                                px: '16px'
                            }}>
                                <Typography
                                    sx={{color: '#667085', mb: '10px'}}>{'Mapping / EPO Version'}</Typography>
                                <Typography>{`${item.mapping_version} / ${item.epo_version}`}</Typography>
                            </Stack>
                            <Stack sx={{
                                border: '1px solid #E4E7EC',
                                backgroundColor: '#FCFCFD',
                                borderRadius: '5px',
                                py: '12px',
                                px: '16px'
                            }}>
                                <Typography
                                    sx={{color: '#667085', mb: '10px'}}>{'eForms XSD'}</Typography>
                                <Typography>{item.eforms_sdk_versions?.join(', ')}</Typography>
                            </Stack>
                            <Stack sx={{
                                border: '1px solid #E4E7EC',
                                backgroundColor: '#FCFCFD',
                                borderRadius: '5px',
                                py: '12px',
                                px: '16px'
                            }}>
                                <Typography
                                    sx={{color: '#667085', mb: '10px'}}>{'eForms Subtype'}</Typography>
                                <Typography>{item.eform_subtypes?.join(', ')}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
            <Grid xs={12}
                  md={4}>
                <ResultSummaryCoverageXpath item={item}
                                            sid={sid}
                                            handleChangeTab={handleChangeTab}
                                            validationReport={validationReport.xpath}/>
            </Grid>
            <Grid xs={12}
                  md={4}>
                <ResultSummaryCoverageSparql item={item}
                                             sid={sid}
                                             handleChangeTab={handleChangeTab}
                                             validationReport={validationReport.sparql}/>
            </Grid>
            <Grid xs={12}
                  md={4}>
                <ResultSummaryCoverageShacl item={item}
                                            sid={sid}
                                            handleChangeTab={handleChangeTab}
                                            validationReport={validationReport.shacl}/>
            </Grid>
        </Grid>
    )
}

export default StateDetails