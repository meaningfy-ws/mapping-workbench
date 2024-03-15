import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const CoverageReport = ({validationReport, mappingSuiteIdentifier}) => {
    const { coveredReports, notCoveredReports } = validationReport.reduce((acc, report) => {
        acc[report.is_covered ? "coveredReports" : "notCoveredReports"].push({ eforms_sdk_element_xpath: report.eforms_sdk_element_xpath })
        return acc
    }, {coveredReports:[], notCoveredReports:[]})

    const coveredReportPercent = (coveredReports.length/validationReport.length*100).toFixed(2)
    const notCoveredReportPercent = (notCoveredReports.length/validationReport.length*100).toFixed(2)

    return(
            <List>
                <ListItem>
                    Mapping suite identifier: {mappingSuiteIdentifier}
                </ListItem>
                <ListItem>
                    XPATHs covered: {coveredReports.length} / {coveredReportPercent}%
                </ListItem>
                <ListItem>
                    XPATHs not covered: {notCoveredReports.length} / {notCoveredReportPercent}%
                </ListItem>
            </List>
    )
}

export default CoverageReport