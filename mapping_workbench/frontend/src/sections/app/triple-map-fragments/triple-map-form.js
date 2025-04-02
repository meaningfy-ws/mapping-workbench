import Typography from '@mui/material/Typography';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';
import CustomTextField from './custom-text-field';
import CustomAccordionSummary from './custom-accordion-summary';

const TripleMapForm = ({formik}) => {
    return (
        <CustomAccordion>
            <CustomAccordionSummary>
                <Typography>Triple Map</Typography>
            </CustomAccordionSummary>
            <AccordionDetails>
                <CustomTextField
                    formik={formik}
                    label='Uri'
                />
            </AccordionDetails>
        </CustomAccordion>
    )
}

export default TripleMapForm