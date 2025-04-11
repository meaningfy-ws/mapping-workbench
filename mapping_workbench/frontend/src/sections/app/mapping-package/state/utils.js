import {useState} from 'react';

import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import {Box} from '@mui/system';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import {capitalize} from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import {useTheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import {MenuActionButton} from '../../../../components/menu-actions';
import {paths} from '../../../../paths';

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

export const ValueChip = ({children, value, color, style}) => {
    const theme = useTheme()
    const themeColor = theme.palette?.[color] ?? {}
    return (
        <Stack sx={{
            px: 1.4,
            py: 0.3,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColor.alpha12,
            color: themeColor.main,
            borderRadius: 5,
            ...style
        }}>{value ?? children}</Stack>
    )
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
    return result.results?.map(e => {
        const resultArray = {}
        resultArray["shacl_suite"] = result.shacl_suites?.[0]?.shacl_suite_id
        resultArray["short_result_path"] = e.short_result_path
        resultArray["short_source_constraint_component"] = e.short_source_constraint_component
        resultArray["result"] = e.result
        Object.entries(e.result).forEach(entry => {
            const [key, value] = entry
            resultArray[`${key}Count`] = value.count
        })
        return resultArray;
    }) ?? []
}


export const mapSparqlResults = (result) => result.map(e => {
    const queryAsArray = e.query?.content.split("\n")
    const values = queryAsArray.slice(0, 3)
    const resultArray = {}
    values.forEach(value => {
            const res = value.split(": ")
            resultArray[res[0].substring(1)] = res[1]
        }
    )
    resultArray["query"] = queryAsArray.slice(4, queryAsArray.length).join("\n")
    resultArray["test_suite"] = e.query?.filename
    resultArray["result"] = e.result
    Object.entries(e.result).forEach(entry => {
        const [key, value] = entry
        resultArray[`${key}Count`] = value.count
    })
    resultArray["meets_xpath_condition"] = e.meets_xpath_condition
    resultArray["fields_covered"] = e.fields_covered
    resultArray["query_result"] = e.query_result
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


export const handleOpenDetails = (title, notices, handleSelect, setDescription) => {
    const description = notices.map((notice, i) =>
        <Stack direction='row'
               justifyContent='space-between'
               key={'notice' + i}>
            <Box>
                <Button type='link'
                        onClick={() => handleSelect(notice.test_data_suite_oid)}
                >
                    {notice.test_data_suite_id}
                </Button>
                {' / '}
                <Button type='link'
                        onClick={() => handleSelect(notice.test_data_suite_oid, notice.test_data_oid)}
                >
                    {notice.test_data_id}
                </Button>
            </Box>
            <Box>
                <CopyDetailsButton notice={notice}/>
                <Tooltip title='Go to file resources'>
                    <IconButton
                        onClick={() => window.open(paths.app.test_data_suites.resource_manager.edit.replace('[id]', notice.test_data_suite_oid).replace('[fid]', notice.test_data_oid), "_blank", "noreferrer")}>
                        <OpenInNewIcon/>
                    </IconButton>
                </Tooltip>
            </Box>
        </Stack>)

    setDescription({open: true, title, description});
}


export const CopyDetailsButton = ({notice}) => {
    const [showMenu, setShowMenu] = useState(undefined)
    const [clipBoard, setClipBoard] = useState(false)

    const onCopy = (text) => {
        navigator.clipboard.writeText(text)
        setClipBoard(true)
        setTimeout(() => {
            setShowMenu(undefined)
        }, 1000)
    }

    const onShowMenu = (e) => {
        setShowMenu(e.target)
        setClipBoard(false)
    }

    return (<>
        <Tooltip title='Copy options...'>
            <IconButton color={clipBoard ? 'primary' : 'default'}
                        onClick={onShowMenu}><ContentPasteIcon/></IconButton>
        </Tooltip>
        <Menu open={!!showMenu}
              onClose={() => setShowMenu(undefined)}
              anchorEl={showMenu}>
            <MenuActionButton title='Copy Full Path'
                              icon={<FolderCopyIcon/>}
                              onClick={() => onCopy(`${notice.test_data_suite_id}/${notice.test_data_id}`)}/>
            <MenuActionButton title='Copy Folder Name'
                              icon={<FolderIcon/>}
                              onClick={() => onCopy(notice.test_data_suite_id)}/>
            <MenuActionButton title='Copy File Name'
                              icon={<InsertDriveFileIcon/>}
                              onClick={() => onCopy(notice.test_data_id)}/>

            {clipBoard && <Stack mt={2}
                                 alignItems='center'>
                Copied
            </Stack>}
        </Menu></>)
}

export const ResultChip = ({label, color, fontColor, onClick, clickable, children}) => {
    const hover = onClick ?? clickable ? {'&:hover': {filter: 'brightness(85%)'}, cursor: 'pointer'} : {}
    return (
        <Box sx={{
            textAlign: 'center',
            px: 1,
            py: .5,
            borderRadius: 12,
            backgroundColor: color,
            color: fontColor, ...hover
        }}
             onClick={onClick}
        >
            {label ?? children}
        </Box>
    )
}

export const ResultCell = ({item, handleSelect, setDescription}) => {
    const title = item.title
    console.log(item)
    return <Stack direction="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  height={100}>
        {Object.entries(item.result).map(([key, value]) => {
            return !!value.count && <Stack direction='row'
                                           key={key}
                                           gap={1}>
                <ValueChip value={value.count}
                           color='primary'
                           sx={{p: 2}}/>
                <ResultChip color={getValidationColor(key)}
                            clickable
                            fontColor='#fff'
                            onClick={() => handleOpenDetails(title, value.test_datas, handleSelect, setDescription)}
                            label={key}
                />
            </Stack>
        })}
    </Stack>
}