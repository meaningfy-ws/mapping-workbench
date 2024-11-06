import {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";

export const TableSearchBar = (props) => {
    const {onChange, value, placeholder} = props;
    const [localValue, setLocalValue] = useState(value ?? '')
    const queryRef = useRef(null);


    const handleChange = (event, value) => {
        event.preventDefault()
        onChange(value)
    }

    const handleClear = () => {
        setLocalValue('')
        onChange('')
    }


    return (
        <Stack
            alignItems="center"
            component="form"
            direction="row"
            onSubmit={(event) => handleChange(event, localValue)}
            spacing={2}
            sx={{p: 1}}
        >
            <IconButton onClick={() => onChange(localValue)}
                        disabled={value === localValue}>
                <SearchIcon color={value ? 'primary' : ''}/>
            </IconButton>
            <Input
                disableUnderline
                fullWidth
                value={localValue}
                onChange={e => setLocalValue(e.target.value)}
                inputProps={{ref: queryRef}}
                placeholder={placeholder ?? "Search"}
                sx={{flexGrow: 1, ...(value === localValue && {color: 'primary.main'})}}
                endAdornment={<IconButton onClick={handleClear}
                                          sx={{visibility: value ? "visible" : "hidden"}}>
                    <ClearIcon/>
                </IconButton>}
            />
        </Stack>
    );
};

TableSearchBar.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    placeholder: PropTypes.string
};
