import {useState} from "react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ClearIcon from '@mui/icons-material/Clear';

export const TableFilterHeader = ({fieldName, title, sort, desc, onSort}) => {
    console.log(sort)
    const [popover, setPopover] = useState(null)
    const [filter, setFilter] = useState('')

    const handleClick = (event) => {
        setPopover(event.currentTarget);
    };

    const handleClose = () => {
        setPopover(null);
    };


    return (
        <Stack direction='row'
               alignItems='center'>
            <Typography variant='h7'
                        onClick={() => onSort(fieldName, desc)}>
                {title ?? fieldName}
            </Typography>
            <IconButton color="inherit"
                        sx={{rotate: 90}}
                        onClick={() => onSort(fieldName, desc)}
                        size="small">
                <ArrowDownwardIcon
                    style={{transform: sort.direction === 'desc' ? 'rotate(180deg)' : '', transition: 'transform 0.4s'}}
                    fontSize='10px'/>
            </IconButton>
            <IconButton onClick={handleClick}
                        size="small">
                <FilterAltIcon fontSize='10px'
                               color={filter ? 'primary' : 'inherit'}/>
            </IconButton>
            <Popover
                id={fieldName + '_popover'}
                open={popover}
                anchorEl={popover}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Paper sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: 400}}>
                    <TextField id="outlined-basic"
                               label={title ?? fieldName}
                               variant="standard"
                               fullWidth
                               InputProps={{
                                   endAdornment: (<IconButton onClick={() => setFilter('')}
                                                              sx={{visibility: filter ? "visible" : "hidden"}}><ClearIcon/></IconButton>)
                               }}
                               value={filter}
                               onChange={(e) => setFilter(e.target.value)}/>
                </Paper>
            </Popover>
        </Stack>
    )
}