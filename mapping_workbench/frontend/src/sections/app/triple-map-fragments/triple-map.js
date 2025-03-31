import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion"
import {AccordionDetails} from "@mui/material";
import Typography from '@mui/material/Typography';
import {FormTextField} from '../../../components/app/form/text-field';
import CustomAccordionSummary from './custom-accordion-summary';

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
                <FormTextField formik={formik}
                               label='Uri'
                               variant='standard'/>
            </AccordionDetails>
        </Accordion>
    )
}

export default TripleMap