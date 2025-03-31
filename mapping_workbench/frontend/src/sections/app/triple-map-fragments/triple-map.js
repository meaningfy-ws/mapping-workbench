import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion"
import {AccordionDetails} from "@mui/material";
import Typography from '@mui/material/Typography';
import CustomAccordionSummary from './custom-accordion-summary';
import CustomTextField from './custom-text-field';

const TripleMap = ({formik}) => {
    return (
        <Accordion sx={{backgroundColor: '#F9FAFB', borderRadius: '12px'}}>
            <CustomAccordionSummary sx={{
                flexDirection: 'row-reverse', gap: 1,
                "& .MuiAccordionSummary-content": {
                    alignItems: 'center', justifyContent: 'space-between'
                }
            }}
                                    expandIcon={<ExpandMoreIcon/>}>
                <Typography>Triple Map</Typography>
            </CustomAccordionSummary>
            <AccordionDetails>
                <CustomTextField
                    formik={formik}
                    label='Uri'
                />
            </AccordionDetails>
        </Accordion>
    )
}

export default TripleMap