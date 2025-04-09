import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';
import CustomAccordionSummary from './custom-accordion-summary';

const SourceForm = (props) => {
    const {file, iterator, type} = props

    const onDelete = (e) => {
        e.stopPropagation()
        console.log(e)
    }

    const currentType = (type) => {
        if (type.endsWith('ql#XPath'))
            return 'ql#XPath'
        if (type.endsWith('ql#JSONPath'))
            return 'ql#JSONPath'
        return 'ql#CSV'
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
                                value={currentType(type)}
                                sx={{
                                    height: 40,
                                    borderRadius: '12px'
                                }}>
                            <MenuItem value='ql#XPath'>XML</MenuItem>
                            <MenuItem value='ql#CSV'>CSV</MenuItem>
                            <MenuItem value='ql#JSONPath'>JSON</MenuItem>
                        </Select>
                    </FormControl>
                    <Card sx={{border: '1px solid #E4E7EC', p: 2, mt: 2}}>
                        <Typography>File</Typography>
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
                                // error={!!(formik.touched[name] && formik.errors[name])}
                                fullWidth
                                disabled={file === 'data/source.xml'}
                                // helperText={formik.touched[name] && formik.errors[name]}
                                // label={label}
                                // name={name}
                                // onBlur={formik.handleBlur}
                                // onChange={formik.handleChange}
                                value={file}
                                required
                                type={type}
                            />
                        </FormControl>
                        <Typography sx={{mt: 2}}>Iterator</Typography>
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
                                // error={!!(formik.touched[name] && formik.errors[name])}
                                fullWidth
                                // helperText={formik.touched[name] && formik.errors[name]}
                                // label={label}
                                // name={name}
                                // onBlur={formik.handleBlur}
                                // onChange={formik.handleChange}
                                value={iterator}
                                required
                                type={type}
                            />
                        </FormControl>
                    </Card>
                </Card>
            </AccordionDetails>
        </CustomAccordion>
    )
}

export default SourceForm