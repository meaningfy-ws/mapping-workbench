import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/system";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

export const resultColor = (result) => {
    switch (result.toLowerCase()) {
        case "error":
        case "invalid":
            return "error"
        case "warning":
            return "warning"
        case "unverifiable":
        case "valid":
            return "success"
        default: return "info"
    }
}

export const ResultChip = ({label, color}) => {
    return(
        <Chip label={label}
          color={resultColor(color ?? label)}/>
    )
}

export const ResultFilter = ({currentState, onStateChange}) => {
    const reportValues = ["valid","unverifiable","warning","invalid","error","unknown"]


    const FilterValue = ({label, value, currentState}) => {
        return (<FormControlLabel
            control={<Radio/>}
            checked={currentState === (value ?? label.toLowerCase())}
            label={(
                <Box sx={{ml: 0, mr: 1}}>
                    <Typography
                        variant="subtitle2"
                    >
                        <ResultChip label={label}/>
                    </Typography>
                </Box>
            )}
            value={value ?? label.toLowerCase()}
        />)
    }

    return(
        <Box sx={{p: 2.5, display: 'flex'}}
                 direction="row">
                <Stack
                    component={RadioGroup}
                    name="terms_validity"
                    spacing={3}
                    onChange={onStateChange}
                >
                    <Paper
                        key="2"
                        sx={{
                            alignItems: 'flex-start',
                            display: 'flex',
                            p: 2
                        }}
                        variant="outlined"
                    >
                        <Box sx={{mr: 2, mt: 1}}>
                            <b>Filter Results:</b>
                        </Box>

                        {reportValues.map(value =>
                            <FilterValue key={value}
                                         label={value}
                                         currentState={currentState}/> )}
                        <FilterValue label={"all"}
                                     value={""}
                                     currentState={currentState}/>

                    </Paper>
                </Stack>
            </Box>
    )
}