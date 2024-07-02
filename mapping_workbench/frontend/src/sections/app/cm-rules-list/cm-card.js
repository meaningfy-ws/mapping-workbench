import {useEffect, useState} from "react";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";

    const statusCM = [
        {label: 'Under development', backgroundColor: '#d9d9d9'},
        {label: 'For internal review', backgroundColor: '#fff2cc'},
        {label: 'For internal consultation', backgroundColor: '#fff2cc'},
        {label: 'For OP consultation', backgroundColor: '#f4cccc'},
        {label: 'For internal consultation(after review)', backgroundColor: '#fff2cc'},
        {label: 'Approved by first internal reviewer', backgroundColor: '#c9daf8'},
        {label: 'Approved by second internal reviewer', backgroundColor: '#c9daf8'},
        {label: 'For OP review (done)',  backgroundColor: '#f4cccc'},
        {label: 'Approved by first OP reviewer', backgroundColor: '#d9ead3'},
        {label: 'Approved by OP (Accepted)', backgroundColor: '#93c47d'},
        {label: 'Change requested by OP', backgroundColor: '#e06666'},
        {label: 'Updated based on OP review', backgroundColor: '#1155cc'}
    ]


const CMCard = () => {

    const [state, setState] = useState({})

    useEffect(() => {
        //load card data
    }, []);

    const handleStatusChange = (e) => {
        setState(prevState => ({...prevState, status: statusCM.find(status => status.label === e.target.value)}))
        console.log(statusCM.find(status => status.label === e.value))
    }

    return(
        <Stack direction={{xs:'column', xl:'row-reverse'}}
               justifyContent={{xs:'space-between'}}
               margin={1}>
            <Stack direction={{xs:'row', xl:'column'}}
                   justifyContent='center'>
                <TextField select
                           onChange={handleStatusChange}
                           sx={{ backgroundColor:state.status?.backgroundColor }}
                           label="Status"
                           value={state.status?.label}
                           name="statusCM">
                    {statusCM.map(status=>
                        <MenuItem
                            key={status.label}
                            value={status.label}
                        >
                            <Typography
                                color="var(--nav-color)"
                                variant="body2"
                            >
                                {status.label}
                            </Typography>
                        </MenuItem>
                    )}
                </TextField>
                <Button>Editorial Notes</Button>
                <Button>Feedback Notes</Button>
                <Button>Mappings Notes</Button>
            </Stack>
            <Box margin={3}>

                <Typography>Context</Typography>
                <Box marginX={1}>
                    <Typography>min/max version</Typography>
                    <Typography>Parent ID</Typography>
                </Box>
                <Typography>Xpath expression of CM Rule</Typography>
                <Box marginX={1}>
                    <Typography>Ontology Fragment</Typography>
                </Box>
                <Box>
                    <Button type='link'>Query1</Button>
                    <Button type='link'>Query2</Button>
                    <Button type='link'>Query3</Button>
                </Box>
            </Box>
        </Stack>
    )
}

export default CMCard