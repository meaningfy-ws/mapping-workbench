import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Box} from '@mui/system';
import {useState} from 'react';
import {capitalize, ResultChip} from '../../sparql-validation-report/utils';
import {ValueChip} from '../../xpath-validation-report/utils';

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

export const getResultColor = (result) => {
    switch (result.toLowerCase()) {
        case "error":
        case "invalid":
        case "violation":
            return "error"
        case "warning":
            return "warning"
        case "unverifiable":
        case "valid":
            return "success"
        default:
            return "info"
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
    resultArray["fields_covered"] = e?.fields_covered
    resultArray["query_result"] = e?.query_result
    resultArray["xpath_condition"] = e.query?.cm_rule?.xpath_condition
    return resultArray;
})


export const ResultFilter = ({currentState, onStateChange, values, count}) => {

    const FilterValue = ({label, value, currentState, count}) => {
        return (
            <FormControlLabel
                control={<Radio/>}
                checked={currentState === (value ?? label.toLowerCase())}
                label={(
                    <Box sx={{ml: 0, mr: 1}}>
                        <Typography
                            variant="subtitle2"
                        >
                            <Stack direction='row'
                                   gap={1}>
                                <ResultChip color={getValidationColor(label)}
                                            fontColor='#fff'
                                            clickable
                                            label={capitalize(label)}/>
                                {!!count && <ValueChip color={'primary'}>{count}</ValueChip>}
                            </Stack>
                        </Typography>

                    </Box>
                )}
                value={value ?? label.toLowerCase()}
            />)
    }

    return (
        <FormControl sx={{p: 2}}>
            <Stack
                direction='row'
                component={RadioGroup}
                name="terms_validity"
                onChange={onStateChange}
            >
                <FilterValue label="all"
                             value=""
                             count={count}
                             currentState={currentState}/>
                {values.map(value =>
                    <FilterValue key={value.value}
                                 value={value.value}
                                 label={value.label ?? value.value}
                                 currentState={currentState}/>)}
            </Stack>
        </FormControl>
    )
}

export const useFileNavigation = (reportTree) => {
    const [selectedPackageState, setSelectedPackageState] = useState()
    const [selectedTestDataset, setSelectedTestDataset] = useState()

    const handleSetPackageState = (file) => {
        setSelectedPackageState(file)
        setSelectedTestDataset(undefined)
    }

    const handleSetTestDataset = (file) => {
        setSelectedTestDataset(file)
    }

    const handleSetTestAndPackage = (testDataSuite, testData) => {
        const packageState = reportTree.test_data_suites.find(tds => tds.oid === testDataSuite)
        setSelectedPackageState(packageState)
        if (testData) {
            setSelectedTestDataset(packageState?.test_data_states.find(ps => ps.oid === testData));
        } else {
            setSelectedTestDataset(undefined)
        }
    }

    return {
        selectedPackageState,
        selectedTestDataset,
        handleSetPackageState,
        handleSetTestDataset,
        handleSetTestAndPackage
    }
}