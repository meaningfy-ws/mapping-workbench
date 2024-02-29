import {useState} from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import XpathValidationReport from "./xpath_validation_report_state";
import XpathValidationReportSuite from "./xpath_validation_report_suite";
import XpathValidationReportTest from "./xpath_validation_report_test";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const tabs = [
    {label: 'Xpath State', value: 'state'},
    {label: 'Xpath Suite', value: 'suite'},
    {label: 'Xpath Test', value: 'test'},
];

const XpathValidationReportView = ({ sid, reportTree }) => {
    const [selectedDataSuite, setSelectedDataSuite] = useState(reportTree.test_data_suites[0])
    const [selectedDataState, setSelectedDataState] = useState(reportTree.test_data_suites[0].test_data_states[0])
    const [currentTab, setCurrentTab] = useState(tabs[0].value)
    const handleDataSuiteChange = (e) => {
        const dataSuite = reportTree?.test_data_suites?.find(suite => suite.oid === e.target.value)
        setSelectedDataSuite(dataSuite);
        setSelectedDataState(dataSuite.test_data_states[0])
    }

    const handleDataStateChange = (e) => {
        setSelectedDataState(selectedDataSuite?.test_data_states?.find(state => state.oid === e.target.value))
    }

    const handleTabsChange = (event, value) => {
        setCurrentTab(value)
    }


    return (
        <>
            <Stack direction="row"
                   justifyContent="space-between">
                <Select
                    onChange={handleDataSuiteChange}
                    value={selectedDataSuite.oid}>
                    {reportTree?.test_data_suites?.map(report =>
                        <MenuItem key={report.oid}
                                  value={report.oid}>
                            {report.identifier}
                        </MenuItem>)}
                </Select>
                <Select
                    onChange={handleDataStateChange}
                    value={selectedDataState.oid}>
                    {selectedDataSuite?.test_data_states?.map(state =>
                        <MenuItem key={state.oid}
                                  value={state.oid}>
                            {state.identifier}
                        </MenuItem>)}
                </Select>
            </Stack>
             <Tabs
                        indicatorColor="primary"
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        sx={{mt: 3}}
                        textColor="primary"
                        value={currentTab}
                        variant="scrollable"
                    >
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                            />
                        ))}
                    </Tabs>
            {currentTab === 'state' &&
                <>
                    <XpathValidationReport sid={sid}/>
                </>
            }
            {currentTab === "suite" &&
                <XpathValidationReportSuite sid={sid}
                                        suiteId={selectedDataSuite.oid}/>
            }
            {currentTab === "test" &&
                <XpathValidationReportTest sid={sid}
                                       suiteId={selectedDataSuite.oid}
                                       testId={selectedDataState.oid}/>
            }
        </>
    )
}

export default XpathValidationReportView