import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from '@mui/material/Stack';
import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";
import {useEffect, useState} from 'react';

import {PropertyList} from "src/components/property-list";
import {PropertyListItem} from "src/components/property-list-item";
import {mappingPackageStatesApi as sectionApi} from '../../../../api/mapping-packages/states';
import ResultSummaryCoverageShacl from './result-summary-coverage-shacl';
import ResultSummaryCoverageSparql from './result-summary-coverage-sparql';
import ResultSummaryCoverageXpath from './result-summary-coverage-xpath';

const StateDetails = ({item, sid, reportTree}) => {
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

    console.log(validationReport)


    return (
        <Grid container
              spacing={3}>
            <Stack direction='row'
                   justifyContent='space-between'
                   width='100%'
                   gap={3}>
                <ResultSummaryCoverageXpath item={item}
                                            sid={sid}
                                            validationReport={validationReport.xpath}/>
                <ResultSummaryCoverageSparql item={item}
                                             sid={sid}
                                             validationReport={validationReport.sparql}/>
                <ResultSummaryCoverageShacl  item={item}
                                             sid={sid}
                                             validationReport={validationReport.shacl}/>
            </Stack>
            <Grid md={12}
                  xs={12}>
                <Card>
                    <CardContent>
                        <Grid
                            item={item}
                            md={12}
                            xs={12}
                        >
                            <PropertyList>
                                <PropertyListItem
                                    label="Description"
                                    value={item.description}
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        px: 3,
                                        py: 1.5
                                    }}
                                />
                                <Divider/>
                                <Grid container
                                      spacing={3}>
                                    <Grid md={6}
                                          xs={12}>
                                        <PropertyListItem
                                            label="Identifier"
                                            value={item.identifier}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="Mapping Version"
                                            value={item.mapping_version}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="EPO Version"
                                            value={item.epo_version}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="eForms Subtype"
                                            value={item.eform_subtypes?.join(', ')}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="Start Date"
                                            value={item.start_date}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="End Date"
                                            value={item.end_date}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="eForms XSD version"
                                            value={item.eforms_sdk_versions?.join(', ')}
                                        />
                                    </Grid>
                                </Grid>
                            </PropertyList>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default StateDetails