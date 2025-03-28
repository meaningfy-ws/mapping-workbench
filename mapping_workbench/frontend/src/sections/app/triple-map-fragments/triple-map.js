import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion"
import {AccordionDetails, AccordionSummary} from "@mui/material";
import {FormTextField} from '../../../components/app/form/text-field';

const TripleMap = ({formik}) => {
    return (
        <Accordion sx={{backgroundColor: '#F9FAFB'}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Triple Map</AccordionSummary>
            <AccordionDetails>
                <FormTextField formik={formik}
                               label='Uri'
                variant='standard'/>
            </AccordionDetails>
        </Accordion>
    )
}

export default TripleMap