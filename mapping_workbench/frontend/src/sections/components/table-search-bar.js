import {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";

export const TableSearchBar = (props) => {
    const {onChange, value, placeholder} = props;
    const queryRef = useRef(null);
    const [localValue, setLocalValue] = useState(value)


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
            sx={{p: 2}}
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
                sx={{flexGrow: 1, color:  value === localValue && 'primary.main'}}
                endAdornment={<IconButton onClick={handleClear}
                                          sx={{visibility: value ? "visible" : "hidden"}}>
                    <ClearIcon sx={{'&.Mui-focused .MuiIconButton': {color: 'primary.main'}}}/>
                </IconButton>}
            />
        </Stack>
    );
};

TableSearchBar.propTypes = {
    onFiltersChange: PropTypes.func
};
