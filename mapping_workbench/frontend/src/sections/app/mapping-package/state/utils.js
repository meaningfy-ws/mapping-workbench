export const getValidationColor = (color) => {
    switch (color) {
        case 'valid':
            return '#90BE6D'
        case 'unverifiable':
        case 'info':
            return '#2D9CDB'
        case 'invalid':
        case 'violation':
            return '#F94144'
        case 'error':
            return '#F8961E'
        case 'warning':
            return '#F9C74F'
        default:
            return '#577590'
    }
}

export const getItemsDisplay = (items, total) => Object.entries(items)?.map(item => {
    const [itemName, itemCount] = item
    const percent = (itemCount / total) * 100 ?? 0

    return {
        label: `${itemName[0].toUpperCase()}${itemName.slice(1)} (${percent.toFixed(2)}% - ${itemCount})`,
        value: itemCount,
        itemPercent: percent.toFixed(2),
        color: getValidationColor(itemName)
    }
})


export const getValidationReportShacl = (items) => items.map(item => item.result).reduce((acc, report) => {
    Object.keys(report).forEach(reportKey => {
            acc[reportKey] = (acc[reportKey] ?? 0) + report[reportKey].count
            acc["itemsTotal"] = (acc["itemsTotal"] ?? 0) + report[reportKey].count
        }
    )
    return acc
}, {info: 0, valid: 0, violation: 0, warning: 0})


export const getValidationReportSparql = (items) => items.map(item => item.result).reduce((acc, report) => {
    Object.keys(report).forEach(reportKey => {
            acc[reportKey] = (acc[reportKey] ?? 0) + report[reportKey].count
            acc["itemsTotal"] = (acc["itemsTotal"] ?? 0) + report[reportKey].count
        }
    )
    return acc
}, {valid: 0, unverifiable: 0, warning: 0, invalid: 0, error: 0, unknown: 0})


export const mapShaclResults = (result) => {
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


export const mapSparqlResults = (result) => result.map(e => {
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