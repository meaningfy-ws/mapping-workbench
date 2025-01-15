import {useEffect, useState} from 'react';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Unstable_Grid2";

import {mappingPackageStatesApi as sectionApi} from '../../../../api/mapping-packages/states';
import ResultSummaryCoverageShacl from './result-summary-coverage-shacl';
import ResultSummaryCoverageSparql from './result-summary-coverage-sparql';
import ResultSummaryCoverageXpath from './result-summary-coverage-xpath';

const StateDetails = ({item, sid, handleChangeTab}) => {
    const [validationReport, setValidationReport] = useState({})
    const [dataState, setDataState] = useState()

    useEffect(() => {
        if (sid) {
            resultSummaryXPATHGet(sid)
            resultSummarySPARQLGet(sid)
            resultSummarySHACLGet(sid)
        }
    }, [sid])


    const resultSummarySPARQLGet = (sid) => {
        sectionApi.getSparqlReports(sid)
            .then(res => {
                setValidationReport(prev => ({...prev, sparql: mapSparqlResults(res.summary)}))
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
            })
    }

    const mapSparqlResults = (result) => result.map(e => {
        const queryAsArray = e.query.content.split("\n")
        const values = queryAsArray.slice(0, 3)
        const resultArray = {}
        values.forEach(e => {
                const res = e.split(": ")
                resultArray[res[0].substring(1)] = res[1]
            }
        )
        resultArray["query"] = queryAsArray.slice(4, queryAsArray.length).join("\n")
        resultArray["test_suite"] = e.query.filename
        resultArray["result"] = e.result
        Object.entries(e.result).forEach(entrie => {
            const [key, value] = entrie
            resultArray[`${key}Count`] = value.count
        })
        resultArray["meets_xpath_condition"] = e.meets_xpath_condition
        resultArray["xpath_condition"] = e.query?.cm_rule?.xpath_condition
        return resultArray;
    })


    const resultSummaryXPATHGet = (sid) => {
        sectionApi.getXpathReports(sid)
            .then(res => {
                setValidationReport(prev => ({
                    ...prev,
                    xpath: res.results.map(e => ({...e, notice_count: e.test_data_xpaths.length}))
                }))
            })
            .catch(err => {
                console.error(err);
            })
    }


    const resultSummarySHACLGet = (sid) => {
        sectionApi.getShaclReports(sid)
            .then(res => {
                setValidationReport(prev => ({...prev, shacl: mapShaclResults(res.summary)}))
            })
            .catch(err => {
                console.error(err);
            })
    }

    const mapShaclResults = (result) => {
        return result.results.map(e => {
            const resultArray = {}
            resultArray["shacl_suite"] = result.shacl_suites?.[0]?.shacl_suite_id
            resultArray["short_result_path"] = e.short_result_path
            resultArray["result"] = e.result
            Object.entries(e.result).forEach(entrie => {
                const [key, value] = entrie
                resultArray[`${key}Count`] = value.count
            })
            return resultArray;
        })
    }

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