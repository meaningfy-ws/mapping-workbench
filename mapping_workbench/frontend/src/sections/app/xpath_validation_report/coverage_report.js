const CoverageReport = ({validationReport}) => {
    const { coveredReports, notCoveredReports } = validationReport.reduce((acc, report) => {
        acc[report.is_covered ? "coveredReports" : "notCoveredReports"].push({ eforms_sdk_element_xpath: report.eforms_sdk_element_xpath })
        return acc
    }, {coveredReports:[], notCoveredReports:[]})

    const coveredReportPercent = (coveredReports.length/validationReport.length*100).toFixed(2)
    const notCoveredReportPercent = (notCoveredReports.length/validationReport.length*100).toFixed(2)

    return(
        <div>
            XPATHs covered: {coveredReports.length} {coveredReportPercent}%
            XPAThs not covered: {notCoveredReports.length} {notCoveredReportPercent}%
        </div>
    )
}

export default CoverageReport