import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";
import {useEffect, useState} from 'react';

import {PropertyList} from "src/components/property-list";
import {PropertyListItem} from "src/components/property-list-item";
import {mappingPackageStatesApi as sectionApi} from '../../../../api/mapping-packages/states';
import ResultSummaryCoverage from './result-summary-coverage';

const StateDetails = ({item, sid, reportTree}) => {
    const [validationReport, setValidationReport] = useState(undefined)
    const [dataState, setDataState] = useState()

    useEffect(() => {
        sid && handleValidationReportsGet(sid)
    }, [sid])

    const handleValidationReportsGet = (sid) => {
        setDataState({load: true, error: false})
        sectionApi.getXpathReports(sid)
            .then(res => {
                setValidationReport(res.results.map(e => ({...e, notice_count: e.test_data_xpaths.length})))
                setDataState(e => ({...e, load: false}))
            })
            .catch(err => {
                console.error(err);
                setDataState({load: false, error: true})
            })
    }

    console.log(validationReport)
    if (!validationReport) return null

    return (
        <Grid container
              spacing={3}>
            <ResultSummaryCoverage item={item}
                                   sid={sid}
                                   validationReport={validationReport}/>
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