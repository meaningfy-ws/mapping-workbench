import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';
import CustomTextField from './custom-text-field';
import CustomAccordionSummary from './custom-accordion-summary';

const PredicateForm = ({label,comment}) => {
    const onDelete = (e) => {
        e.stopPropagation()
        console.log(e)
    }

    return (
        <CustomAccordion>
            <CustomAccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Predicate</Typography>
                <IconButton onClick={onDelete}><DeleteOutlineIcon color='error'/></IconButton>
            </CustomAccordionSummary>
            <AccordionDetails>
                <Card sx={{border: '1px solid #E4E7EC', p: 2}}>
                    <Typography>Type</Typography>
                    <FormControl fullWidth>
                        <Select variant='outlined'
                                sx={{
                                    height: 40,
                                    borderRadius: '12px'
                                }}>
                            <MenuItem>text</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography>Property</Typography>
                    <FormControl fullWidth>
                        <Select variant='outlined'
                                sx={{
                                    height: 40,
                                    borderRadius: '12px'
                                }}>
                            <MenuItem>text</MenuItem>
                        </Select>
                    </FormControl>
                    {/*<CustomTextField label='Label'*/}
                    {/*                 formik={formik}/>*/}
                    <Typography>Label</Typography>
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                backgroundColor: "white",
                                height: 40
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        value={label}
                        required
                    />
                    {/*<CustomTextField label='Comment'*/}
                    {/*                 formik={formik}/>*/}
                    <Typography>Comment</Typography>
                    <TextField
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                backgroundColor: "white",
                                height: 40
                            }
                        }}
                        variant='outlined'
                        fullWidth
                        value={comment}
                        required
                    />
                    <Typography sx={{mt: 2}}>Target</Typography>
                    <FormControl fullWidth>
                        <Select variant='outlined'
                                sx={{
                                    height: 40,
                                    borderRadius: '12px'
                                }}>
                            <MenuItem>text</MenuItem>
                        </Select>
                    </FormControl>
                    {/*<CustomTextField label='Source Reference'*/}
                    {/*                 formik={formik}/>*/}
                    {/*<CustomTextField label='Join With'*/}
                    {/*                 formik={formik}/>*/}
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox/>}
                            label="No join condition"/>
                    </FormGroup>
                </Card>
            </AccordionDetails>
        </CustomAccordion>
    )
}

export default PredicateForm