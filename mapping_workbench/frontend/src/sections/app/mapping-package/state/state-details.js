import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";

import ResultSummaryCoverageShacl from './result-summary-coverage-shacl';
import ResultSummaryCoverageSparql from './result-summary-coverage-sparql';
import ResultSummaryCoverageXpath from './result-summary-coverage-xpath';

const StateDetail = ({title, value}) => {
    const theme = useTheme()
    console.log(theme)
    return (
        <Stack sx={{
            border: '1px solid #E4E7EC',
            backgroundColor: theme.palette.divider,
            //                 backgroundColor:'#FCFCFD',
            borderRadius: '5px',
            py: '12px',
            px: '16px'
        }}>
            <Typography sx={{color: '#667085', mb: '10px'}}>{title}</Typography>
            <Typography>{value}</Typography>
        </Stack>
    )
}

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
                            <StateDetail title={item._id}
                                         value={item.title}/>
                            <StateDetail title={'Mapping / EPO Version'}
                                         value={`${item.mapping_version} / ${item.epo_version}`}/>
                            <StateDetail title={'eForms XSD'}
                                         value={item.eforms_sdk_versions?.join(', ')}/>
                            <StateDetail title={'eForms Subtype'}
                                         value={item.eform_subtypes?.join(', ')}/>
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