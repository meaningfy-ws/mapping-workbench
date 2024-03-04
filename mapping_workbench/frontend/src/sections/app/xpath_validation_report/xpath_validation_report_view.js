import {useState} from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ToggleButton from "@mui/material/ToggleButton";

import XpathValidationReport from "./xpath_validation_report_package_state";
import XpathValidationReportSuite from "./xpath_validation_report_test_dataset";
import XpathValidationReportTest from "./xpath_validation_report_file";

import {BreadcrumbsSeparator} from "../../../components/breadcrumbs-separator";


const tabs = [
    {label: 'Package State XPath Coverage', value: 'package_state'},
    {label: 'Test Dataset XPath Coverage', value: 'test_dataset'},
    {label: 'File XPath Coverage', value: 'file'},
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
            {/*<Stack direction="row"*/}
            {/*       justifyContent="space-between">*/}
            {/*    <Select*/}
            {/*        onChange={handleDataSuiteChange}*/}
            {/*        value={selectedDataSuite.oid}>*/}
            {/*        {reportTree?.test_data_suites?.map(report =>*/}
            {/*            <MenuItem key={report.oid}*/}
            {/*                      value={report.oid}>*/}
            {/*                {report.identifier}*/}
            {/*            </MenuItem>)}*/}
            {/*    </Select>*/}
            {/*    <Select*/}
            {/*        onChange={handleDataStateChange}*/}
            {/*        value={selectedDataState.oid}>*/}
            {/*        {selectedDataSuite?.test_data_states?.map(state =>*/}
            {/*            <MenuItem key={state.oid}*/}
            {/*                      value={state.oid}>*/}
            {/*                {state.identifier}*/}
            {/*            </MenuItem>)}*/}
            {/*    </Select>*/}
            {/*</Stack>*/}
            {/*<Tabs*/}
            {/*    indicatorColor="primary"*/}
            {/*    onChange={handleTabsChange}*/}
            {/*    scrollButtons="auto"*/}
            {/*    sx={{mt: 3}}*/}
            {/*    textColor="primary"*/}
            {/*    value={currentTab}*/}
            {/*    variant="scrollable"*/}
            {/*>*/}
            {/*    {tabs.map((tab) => (*/}
            {/*        <Tab*/}
            {/*            key={tab.value}*/}
            {/*            label={tab.label}*/}
            {/*            value={tab.value}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</Tabs>*/}
            <Stack spacing={1}>
                <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                    {/* <Typography*/}
                    {/*    color="text.secondary"*/}
                    {/*    variant="subtitle2"*/}
                    {/*>*/}
                    {/*    Package State XPath Coverage*/}
                    {/*</Typography>*/}
                    <ToggleButton variant="link"
                                  color="primary"
                                  value="package_state"
                                  selected={currentTab === "package_state"}
                                  onChange={()=>setCurrentTab("package_state")}
                    >
                        Package State XPath Coverage
                    </ToggleButton>
                    <Stack direction="row"
                           alignItems="center">
                        {/*<Typography*/}
                        {/*    color="text.secondary"*/}
                        {/*    variant="subtitle2"*/}
                        {/*    marginRight={1}*/}
                        {/*>*/}
                        {/*    Test Dataset XPath Coverage :*/}
                        {/*</Typography>*/}
                        <ToggleButton variant="link"
                                      color="primary"
                                      value="test_dataset"
                                      selected={currentTab === "test_dataset"}
                                      onChange={() => setCurrentTab("test_dataset")}
                        >
                            Package State XPath Coverage
                        </ToggleButton>
                        <Select
                            variant="standard"
                            onChange={handleDataSuiteChange}
                            value={selectedDataSuite.oid}>
                            {reportTree?.test_data_suites?.map(report =>
                                <MenuItem key={report.oid}
                                          value={report.oid}>
                                    {report.identifier}
                                </MenuItem>)}
                        </Select>
                    </Stack>
                    <Stack direction="row"
                           alignItems="center">
                        {/*<Typography*/}
                        {/*        color="text.secondary"*/}
                        {/*        variant="subtitle2"*/}
                        {/*        marginRight={1}*/}
                        {/*    >*/}
                        {/*        File XPath Coverage :*/}
                        {/*</Typography>*/}
                        <ToggleButton variant="link"
                                      color="primary"
                                      value="file"
                                      selected={currentTab === "file"}
                                      onChange={() => setCurrentTab("file")}
                        >
                            File XPath Coverage
                        </ToggleButton>
                        <Select
                            variant="standard"
                            onChange={handleDataStateChange}
                            value={selectedDataState.oid}>
                            {selectedDataSuite?.test_data_states?.map(state =>
                                <MenuItem key={state.oid}
                                          value={state.oid}>
                                    {state.identifier}
                                </MenuItem>)}
                        </Select>
                    </Stack>

                </Breadcrumbs>
            </Stack>
            {currentTab === "package_state" &&
                <XpathValidationReport sid={sid}/>
            }
            {currentTab === "test_dataset" &&
                <XpathValidationReportSuite sid={sid}
                                        suiteId={selectedDataSuite.oid}/>
            }
            {currentTab === "file" &&
                <XpathValidationReportTest sid={sid}
                                       suiteId={selectedDataSuite.oid}
                                       testId={selectedDataState.oid}/>
            }
        </>
    )
}

export default XpathValidationReportView