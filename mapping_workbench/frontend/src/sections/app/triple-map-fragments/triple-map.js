import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from "@mui/material/Accordion"
import {AccordionDetails, AccordionSummary} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {FormTextField} from '../../../components/app/form/text-field';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomAccordionSummary from './custom-accordion-summary';

const TripleMap = ({formik}) => {
    return (
        <Accordion sx={{backgroundColor: '#F9FAFB', borderRadius: '12px', p: 2}}>
            <CustomAccordionSummary sx={{
                flexDirection: 'row-reverse', gap: 1,
                "& .MuiAccordionSummary-content": {
                    alignItems: 'center', justifyContent: 'space-between'
                }
            }}
                              expandIcon={<ExpandMoreIcon/>}>
                {/*<Stack direction='row' alignItems='space-between'>*/}
                <Typography>Triple Map</Typography>
                {/*</Stack>*/}
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