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
        <Accordion sx={{backgroundColor: '#F9FAFB', borderRadius: '12px'}}>
            <CustomAccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Source</Typography>
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
                    <Card sx={{border: '1px solid #E4E7EC', p: 2, mt: 2}}>
                        <Typography>File</Typography>
                        <FormControl fullWidth>
                            <Select variant='outlined'
                                    sx={{
                                        height: 40,
                                        borderRadius: '12px'
                                    }}>
                                <MenuItem>text</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography sx={{mt: 2}}>Iterator</Typography>
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
                </Card>
            </AccordionDetails>
        </Accordion>
    )
}

export default Source