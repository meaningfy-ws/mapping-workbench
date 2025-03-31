import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Accordion from "@mui/material/Accordion"
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordionSummary from './custom-accordion-summary';
import CustomTextField from './custom-text-field';

const Predicate = ({formik}) => {
    const onDelete = (e) => {
        e.stopPropagation()
        console.log(e)
    }

    return (
        <Accordion sx={{backgroundColor: '#F9FAFB', borderRadius: '12px', m: "0 !important", mb: "8px !important"}}>
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
                    <CustomTextField label='Label'
                                     formik={formik}/>
                    <CustomTextField label='Comment'
                                     formik={formik}/>

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
                    <CustomTextField label='Source Reference'
                                     formik={formik}/>
                    <CustomTextField label='Join With'
                                     formik={formik}/>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox/>}
                            label="No join condition"/>
                    </FormGroup>
                </Card>
            </AccordionDetails>
        </Accordion>
    )
}

export default Predicate