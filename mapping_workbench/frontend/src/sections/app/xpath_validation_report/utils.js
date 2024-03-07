import Stack from "@mui/material/Stack";
import RadioGroup from "@mui/material/RadioGroup";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";

export const CoverageFilter = ({onChange,filterState}) => {
    return(
        <Box sx={{p: 2.5, display: 'flex'}}
             direction="row">
            <Stack
                component={RadioGroup}
                name="terms_validity"
                spacing={3}
                onChange={onChange}
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
                        <b>Filter Coverage:</b>
                    </Box>
                    <FormControlLabel
                        control={<Radio/>}
                        key="terms_validity_all"
                        checked={filterState === ""}
                        label={(
                            <Box sx={{ml: 0, mr: 1}}>
                                <Typography
                                    variant="subtitle2"
                                >
                                    All
                                </Typography>
                            </Box>
                        )}
                        value=""
                    />
                    <FormControlLabel
                        control={<Radio/>}
                        key="terms_validity_valid"
                        checked={filterState === "true"}
                        label={(
                            <Box sx={{ml: 0, mr: 1}}>
                                <Typography
                                    variant="subtitle2"
                                >
                                    Covered
                                </Typography>
                            </Box>
                        )}
                        value="true"
                    />
                    <FormControlLabel
                        control={<Radio/>}
                        key="terms_validity_invalid"
                        checked={filterState === "false"}
                        label={(
                            <Box sx={{ml: 0, mr: 1}}>
                                <Typography
                                    variant="subtitle2"
                                >
                                    Not Covered
                                </Typography>
                            </Box>
                        )}
                        value="false"
                    />
                </Paper>
            </Stack>
        </Box>
    )
}