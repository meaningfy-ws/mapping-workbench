import {useEffect, useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AccordionDetails from "@mui/material/AccordionDetails";
import {getTripleMap} from '../generic-triple-map-fragment/rdflib-converter';

import CustomAccordion from './custom-accordion';
import CustomAccordionSummary from './custom-accordion-summary';

const TripleMapForm = ({formik, rdfContent}) => {
    const [tmap, setTmap] = useState([])
    useEffect(() => {
        setTmap(getTripleMap(rdfContent))
    }, []);

    console.log(tmap)

    return (
        <CustomAccordion>
            <CustomAccordionSummary>
                <Typography>Triple Map</Typography>
            </CustomAccordionSummary>
            <AccordionDetails>
                <Autocomplete
                    disablePortal
                    options={tmap}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField
                        fullWidth
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