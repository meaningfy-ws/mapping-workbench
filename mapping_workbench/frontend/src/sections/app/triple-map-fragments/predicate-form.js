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
import CustomAccordionSummary from './custom-accordion-summary';

const PredicateForm = ({label, comment, type, predicate, parent, handleUpdate, handleDelete}) => {
    const onDelete = (e) => {
        e.stopPropagation()
        handleDelete()
    }

    const handlePredicateChange = (value) => {
        handleUpdate({label, comment, ...value})
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
                                value={type}
                                onChange={(e) => handlePredicateChange({type: e.target.value})}
                                sx={{
                                    height: 40,
                                    borderRadius: '12px'
                                }}>
                            <MenuItem value='attribute'>Attribute</MenuItem>
                            <MenuItem value='relationship'>Relationship</MenuItem>
                            <MenuItem value='vocabulary'>Vocabulary</MenuItem>
                            <MenuItem value='uri'>URI</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography>Property</Typography>
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
                        onChange={(e) => handlePredicateChange({predicate: e.target.value})}
                        value={predicate}
                        required
                    />
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
                        onChange={(e) => handlePredicateChange({label: e.target.value})}
                        value={label}
                        required
                    />
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
                        onChange={(e) => handlePredicateChange({comment: e.target.value})}
                        value={comment}
                        required
                    />
                    {['relationship', 'vocabulary'].includes(type) && <><Typography sx={{mt: 2}}>Target</Typography>
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
                            onChange={(e) => handlePredicateChange({parent: e.target.value})}
                            value={parent}
                            required
                        />
                    </>}
                    <FormGroup>
                        <FormControlLabel
                            disabled
                            control={<Checkbox checked={true}/>}
                            label="No join condition"/>
                    </FormGroup>
                </Card>
            </AccordionDetails>
        </CustomAccordion>
    )
}

export default PredicateForm