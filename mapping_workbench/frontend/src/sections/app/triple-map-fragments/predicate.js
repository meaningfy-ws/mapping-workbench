import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion"
import {AccordionDetails, AccordionSummary} from "@mui/material";
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import {FormTextField} from '../../../components/app/form/text-field';
import CustomAccordionSummary from './custom-accordion-summary';

const Predicate = ({formik}) => {
    return (
        <Accordion sx={{backgroundColor: '#F9FAFB', borderRadius: '12px'}}>
            <CustomAccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Predicate</Typography>
                <IconButton><DeleteOutlineIcon color='error'/></IconButton>
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
                    <Typography sx={{mt: 2}}>Label</Typography>
                    <FormControl fullWidth>
                        <Select variant='outlined'
                                sx={{
                                    height: 40,
                                    borderRadius: '12px'
                                }}>
                            <MenuItem>text</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography sx={{mt: 2}}>Comment</Typography>
                    <FormControl fullWidth>
                        <Select variant='outlined'
                                sx={{
                                    height: 40,
                                    borderRadius: '12px'
                                }}>
                            <MenuItem>text</MenuItem>
                        </Select>
                    </FormControl>
                </Card>
            </AccordionDetails>
        </Accordion>
    )
}

export default Predicate