import * as React from "react";
import {useEffect, useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Input from "@mui/material/Input";


export const ListSelectorSelect = (props) => {
    const {
        valuesApi, titleField = "title", listValues = [], initProjectValues = [],
        multiple = true,
        valuesForSelector = null,
        valuesFilters = {},
        ...other
    } = props;

    const [stateValues, setStateValues] = useState(listValues);
    const [projectValues, setProjectValues] = useState(initProjectValues);
    const [valuesMap, setValuesMap] = useState({});

    useEffect(() => {
        (async () => {
            if (initProjectValues.length === 0) {
                setProjectValues(await (
                    (valuesForSelector && valuesForSelector(valuesFilters)) || valuesApi.getValuesForSelector(valuesFilters))
                );
            }
        })()
    }, [valuesApi])

    useEffect(() => {
        (() => {
            setValuesMap(projectValues.reduce((a, b) => {
                a[b['id']] = b[titleField];
                return a
            }, {}));
        })()
    }, [projectValues, titleField])

    const handleChange = (event) => {
        const {
            target: {value},
        } = event;
        let values = (typeof value === 'string' ? value.split(',') : value);
        listValues.length = 0;
        for (let v of values) {
            listValues.push(v);
        }
        setStateValues(values);
    };

    return (
        <FormControl sx={{my: 2, width: '100%'}}>
            <InputLabel id="demo-multiple-chip-label">
                {multiple ? valuesApi.SECTION_TITLE : valuesApi.SECTION_ITEM_TITLE}
            </InputLabel>
            <Select
                sx={{width: '100%'}}
                multiple={multiple}
                value={stateValues}
                onChange={handleChange}
                input={<Input id="select-multiple-chip" label={valuesApi.SECTION_ITEM_TITLE}/>}
                renderValue={(selected) => {
                    return (
                        <Box p={1} sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, width: '100%'}}>
                            {selected.map((item) => (
                                <Chip key={item}
                                      label={valuesMap[item]}/>
                            ))}
                        </Box>
                    )
                }}
            >
                {projectValues.map((project_value) => (
                    <MenuItem
                        key={project_value.id}
                        value={project_value.id}
                    >
                        {project_value[titleField]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
