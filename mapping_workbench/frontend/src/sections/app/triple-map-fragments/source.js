import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion"
import {AccordionDetails, AccordionSummary} from "@mui/material";
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import {FormTextField} from '../../../components/app/form/text-field';
import CustomAccordionSummary from './custom-accordion-summary';

const Source = ({formik}) => {
    return (
        <Accordion sx={{backgroundColor: '#F9FAFB', borderRadius: '12px', p: 2}}>
            <CustomAccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Source</Typography>
                <IconButton><DeleteOutlineIcon color='error'/></IconButton>
            </CustomAccordionSummary>
            <AccordionDetails>
                <Card>
                    <Typography>Type</Typography>
                    <FormControl fullWidth>
                        <InputLabel>Age</InputLabel>
                        <Select variant='standard'>
                            <MenuItem>text</MenuItem>
                        </Select>
                    </FormControl>
                    <FormTextField formik={formik}
                                   label='Uri'
                                   variant='standard'/>
                </Card>
            </AccordionDetails>
        </Accordion>
    )
}

export default Source