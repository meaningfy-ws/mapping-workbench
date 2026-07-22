import {useState} from 'react';

import CheckIcon from '@mui/icons-material/Check';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import AccordionDetails from "@mui/material/AccordionDetails";

import CustomAccordion from './custom-accordion';
import CustomAccordionSummary from './custom-accordion-summary';

const TripleMapForm = ({selectedTripleMap, setSelectedTripleMap, tripleMaps, addTripleMap}) => {

    const [addPopover, setAddPopover] = useState(null)

    const [tripleMapName, setTripleMapName] = useState('')

    const handleAddClick = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setAddPopover(e.currentTarget)
    }

    const handleSubmit = (e) => {
        console.log(e)
        e.stopPropagation()
        e.preventDefault()

        const value = e.target[0].value
        if (value) {
            addTripleMap(value)
            setAddPopover(null)
        }
    }

    return (
        <>
            <CustomAccordion>
                <CustomAccordionSummary>
                    <Typography>Triple Map</Typography>
                    <IconButton onClick={handleAddClick}><AddIcon/></IconButton>
                </CustomAccordionSummary>
                <AccordionDetails>
                    <Autocomplete
                        id='triple_map'
                        fullWidth
                        disablePortal
                        options={tripleMaps}
                        value={selectedTripleMap}
                        onChange={(e, v) => setSelectedTripleMap(v)}
                        renderInput={(params) =>
                            <TextField {...params}
                                       label="URI"/>}
                    />
                    {/*<CustomTextField*/}
                    {/*    formik={formik}*/}
                    {/*    label='Uri'*/}
                    {/*/>*/}
                </AccordionDetails>
            </CustomAccordion>
            <Popover open={!!addPopover}
                     anchorEl={addPopover}
                     onClose={() => setAddPopover(null)}
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'left',
                     }}>
                <Paper sx={{m: 2}}>
                    <form onSubmit={handleSubmit}>
                        <Stack>
                            <TextField label='New Triple Map Name'
                                value={tripleMapName}
                                       onChange={e => setTripleMapName(e.target.value)}></TextField>
                            <Button type='submit'
                                    disabled={!tripleMapName}>
                                <CheckIcon/>
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Popover>
        </>
    )
}

export default TripleMapForm