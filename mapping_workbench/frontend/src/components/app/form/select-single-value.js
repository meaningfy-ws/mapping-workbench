import * as React from "react";
import {useEffect, useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from "@mui/material/TextField";


export const SingleSelectorSelect = (props) => {
    const {
        valuesApi, initValue, titleField = "title", initProjectValues = [],
        name, required = false,
        handleStateOnSelect = null,
        ...other
    } = props;

    const [stateValue, setStateValue] = useState(initValue);
    const [projectValues, setProjectValues] = useState(initProjectValues);

    useEffect(() => {
        (async () => {
            if (initProjectValues.length === 0) {
                setProjectValues(await valuesApi.getValuesForSelector());
            }
        })()
    }, [valuesApi])

    const handleChange = (event) => {
        const {
            target: {value},
        } = event;

        setStateValue(value);
    };

    return (
        <FormControl sx={{my: 2, width: '100%'}}>
            <TextField
                fullWidth
                label={valuesApi.SECTION_ITEM_TITLE}
                name={name}
                onChange={handleChange}
                select
                value={stateValue}
                required={required}
            >
                {projectValues.map((x) => (
                    <MenuItem
                        key={x.id}
                        value={x.id}
                    >
                        {x[titleField]}
                    </MenuItem>
                ))}
            </TextField>
        </FormControl>
    )
}
