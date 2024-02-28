import {useState} from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import XpathValidationReport from "./xpath_validation_report";
import XpathValidationReportSuite from "./xpath_validation_report_suite";
import XpathValidationReportTest from "./xpath_validation_report_test";


const XpathValidationReportView = ({ project_id, id, sid, files, reportTree }) => {
    const [selectedDataSuite, setSelectedDataSuite] = useState(reportTree.test_data_suites[0])
    const [selectedDataState, setSelectedDataState] = useState(reportTree.test_data_suites[0].test_data_states[0])

    return (
        <>
            <Stack direction="row"
                   justifyContent="space-between">
                <Select
                    onChange={(e) => {
                        setSelectedDataSuite(reportTree?.test_data_suites?.find(suite => suite.oid === e.target.value));
                    }}
                    value={selectedDataSuite.oid}>
                    {reportTree?.test_data_suites?.map(report =>
                        <MenuItem key={report.oid}
                                  value={report.oid}>
                            {report.identifier}
                        </MenuItem>)}
                </Select>
                <Select
                    onChange={(e) => {
                        setSelectedDataState(selectedDataSuite?.test_data_states?.find(state => state.oid === e.target.value))
                    }}
                    value={selectedDataState.oid}>
                    {selectedDataSuite?.test_data_states?.map(state =>
                        <MenuItem key={state.oid}
                                  value={state.oid}>
                            {state.identifier}
                        </MenuItem>)}
                </Select>
            </Stack>
            <XpathValidationReport sid={sid}/>
            <XpathValidationReportSuite sid={sid} suiteId={selectedDataSuite.oid}/>
            <XpathValidationReportTest sid={sid} suiteId={selectedDataSuite.oid} testId={selectedDataState.oid}/>
        </>
    )
}

export default XpathValidationReportView