import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';
import CustomAccordionSummary from './custom-accordion-summary';

const TripleMapForm = ({selectedTripleMap, setSelectedTripleMap,tripleMaps}) => {


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
                    options={tripleMaps}
                    value={selectedTripleMap}
                    onChange={(e, v) => setSelectedTripleMap(v)}
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