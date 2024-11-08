import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

export const Filter = ({value, onValueChange, values, title}) => {
    return (
        <FormControl sx={{p: 2}}>
            <Stack direction='row'
                   alignItems='center'
                   gap={2}>
                <FormLabel id="demo-row-radio-buttons-group-label"
                           sx={{fontWeight: 'bold', fontSize: 16}}>{title ?? 'Filter'}</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                >
                    {values.map(e => <FormControlLabel key={e.label}
                                                       value={e.value}
                                                       control={<Radio/>}
                                                       label={e.label}/>)}
                </RadioGroup>
            </Stack>
        </FormControl>
    )
}