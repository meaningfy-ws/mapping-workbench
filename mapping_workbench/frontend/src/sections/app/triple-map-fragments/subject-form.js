import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Card from '@mui/material/Card';
import Radio from '@mui/material/Radio';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';
import CustomAccordionSummary from './custom-accordion-summary';

const SubjectForm = ({template, sclass, label, type, handleUpdate, handleDelete}) => {

    const handleSubjectChange = (value) => {
        handleUpdate({template, sclass, label, ...value})
    }

    const onDelete = (e) => {
        e.stopPropagation()
        handleDelete()
    }

    return (
        <CustomAccordion>
            <CustomAccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Subject</Typography>
                <IconButton onClick={onDelete}><DeleteOutlineIcon color='error'/></IconButton>
            </CustomAccordionSummary>
            <AccordionDetails>
                <Card sx={{border: '1px solid #E4E7EC', p: 2}}>
                    <Typography>Type</Typography>
                    <FormControl fullWidth>
                        <RadioGroup row
                                    onChange={e => handleSubjectChange({type: e.target.value})}
                                    value={type}>
                            <FormControlLabel value="plain"
                                              control={<Radio/>}
                                              label="Plain"/>
                            <FormControlLabel value="conditional"
                                              defaultChecked={!!template}
                                              control={<Radio/>}
                                              label="Conditional"/>
                        </RadioGroup>
                    </FormControl>
                    <Card sx={{border: '1px solid #E4E7EC', p: 2, mt: 2}}>
                        <Typography>Class</Typography>
                        <FormControl fullWidth>
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
                                onChange={(e) => handleSubjectChange({sclass: e.target.value})}
                                value={sclass}
                                required
                            />
                        </FormControl>
                        <Typography sx={{mt: 2}}>Template</Typography>
                        <FormControl fullWidth>
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
                                onChange={(e) => handleSubjectChange({template: e.target.value})}
                                value={template}
                                required
                            />
                        </FormControl>
                        <Typography sx={{mt: 2}}>Label</Typography>
                        <FormControl fullWidth>
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
                                onChange={(e) => handleSubjectChange({label: e.target.value})}
                                value={label}
                                required
                            />
                        </FormControl>
                    </Card>
                </Card>
            </AccordionDetails>
        </CustomAccordion>
    )
}

export default SubjectForm