import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';
import CustomAccordionSummary from './custom-accordion-summary';

const TripleMapForm = ({formik,}) => {



    return (
        <CustomAccordion>
            <CustomAccordionSummary>
                <Typography>Triple Map</Typography>
            </CustomAccordionSummary>
            <AccordionDetails>
                <Autocomplete
                    id='triple_map'
                    fullWidth
                    disablePortal
                    options={formik.values.tripleMaps}
                    value={formik.values.selectedTripleMap}
                    onChange={(e,v) => formik.setFieldValue('selectedTripleMap',v)}
                    renderInput={(params) => <TextField
                        {...params}
                        label="URI"/>}
                />
                {/*<CustomTextField*/}
                {/*    formik={formik}*/}
                {/*    label='Uri'*/}
                {/*/>*/}
            </AccordionDetails>
        </CustomAccordion>
    )
}

export default TripleMapForm