import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Card from '@mui/material/Card';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';
import CustomAccordionSummary from './custom-accordion-summary';

const PredicateForm = ({
                           label,
                           comment,
                           type,
                           predicate,
                           oMapReference,
                           oMapDatatype,
                           parent,
                           joinChild,
                           joinParent,
                           handleUpdate,
                           handleDelete
                       }) => {
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
                    <Typography sx={{mt: 2}}>Type</Typography>
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
                            <MenuItem disabled value='vocabulary'>Vocabulary (coming soon)</MenuItem>
                            <MenuItem disabled value='uri'>URI (coming soon)</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography sx={{mt: 2}}>Property</Typography>
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
                    <Typography sx={{mt: 2}}>Label</Typography>
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
                    <Typography sx={{mt: 2}}>Comment</Typography>
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


                    {!['attribute', 'uri'].includes(type) && <><Typography sx={{mt: 2}}>Source Reference</Typography>
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
                            onChange={(e) => handlePredicateChange({joinChild: e.target.value})}
                            value={joinChild}
                            required
                        />
                    </>}
                    {'attribute' === type && <><Typography sx={{mt: 2}}>Source Reference</Typography>
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
                            onChange={(e) => handlePredicateChange({oMapReference: e.target.value})}
                            value={oMapReference}
                            required
                        />
                        <Typography sx={{mt: 2}}>Type</Typography>
                        <FormControl fullWidth>
                            <RadioGroup row
                                        value={type}>
                                <FormControlLabel value="datatype"
                                                  disabled
                                                  checked
                                                  control={<Radio/>}
                                                  label="Datatype"/>
                                <Tooltip title={'Coming soon!'}>
                                    <FormControlLabel value="language"
                                                      disabled
                                                      control={<Radio/>}
                                                      label="Language"/>
                                </Tooltip>
                            </RadioGroup>
                        </FormControl>
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
                            onChange={(e) => handlePredicateChange({oMapDatatype: e.target.value})}
                            value={oMapDatatype}
                            required
                        />
                    </>}
                    {joinParent && joinChild && <>
                        <Typography sx={{mt: 2}}>Join With</Typography>
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
                            onChange={(e) => handlePredicateChange({joinParent: e.target.value})}
                            value={joinParent}
                            required
                        />
                    </>}
                    {['relationship', 'vocabulary'].includes(type) && <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={!joinParent || !joinChild}/>}
                            label="No join condition"/>
                    </FormGroup>}
                </Card>
            </AccordionDetails>
        </CustomAccordion>
    )
}

export default PredicateForm