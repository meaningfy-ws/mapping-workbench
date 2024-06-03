import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const CoverageReport = ({validationReport, mappingSuiteIdentifier}) => {
    const { coveredReports, notCoveredReports } = validationReport.reduce((acc, report) => {
        acc[report.is_covered ? "coveredReports" : "notCoveredReports"].push({ sdk_element_xpath: report.sdk_element_xpath })
        return acc
    }, {coveredReports:[], notCoveredReports:[]})

    const coveredReportPercent = (coveredReports.length/validationReport.length*100).toFixed(2)
    const notCoveredReportPercent = (notCoveredReports.length/validationReport.length*100).toFixed(2)

    return(
            <List>
                <ListItem>
                    <b>Mapping suite identifier</b>: {mappingSuiteIdentifier}
                </ListItem>
                <ListItem>
                    <b>XPATHs covered</b>: {coveredReports.length} / {coveredReportPercent}%
                </ListItem>
                <ListItem>
                    <b>XPATHs not covered</b>: {notCoveredReports.length} / {notCoveredReportPercent}%
                </ListItem>
            </List>
    )
}

export default CoverageReport