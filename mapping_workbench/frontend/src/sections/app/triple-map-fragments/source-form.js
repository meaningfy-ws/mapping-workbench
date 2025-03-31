import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';

import CustomAccordionSummary from './custom-accordion-summary';

const SourceForm = ({formik}) => {
    const onDelete = (e) => {
        e.stopPropagation()
        console.log(e)
    }

    return (
        <CustomAccordion>
            <CustomAccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Source</Typography>
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
                            <MenuItem>XML</MenuItem>
                            <MenuItem>CSV</MenuItem>
                            <MenuItem>JSON</MenuItem>
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
        </CustomAccordion>
    )
}

export default SourceForm