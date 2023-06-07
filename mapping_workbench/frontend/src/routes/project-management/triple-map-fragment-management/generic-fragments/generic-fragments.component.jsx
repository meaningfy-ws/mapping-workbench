import { Box, FormControl, InputLabel, NativeSelect, TextField } from '@mui/material';
import Button from '../../../../components/button/button.component';
//import Prism from 'prismjs';

import './generic-fragments.component.scss';


const GenericFragments = () => {    
    
    // The code snippet you want to highlight, as a string
const code = `var data = 1;`;

// Returns a highlighted HTML string
//const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

    return (
        <div className="mapping-workbench-generic-fragments-container">
            <h3 className='page-title'>Generic Fragments</h3>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <FormControl>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Triple Map URI
                    </InputLabel>
                    <NativeSelect
                        sx={{ minWidth: '300px' }}
                        defaultValue={10}
                        inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                        }}
                    >
                        <option value={10}>URI1</option>
                        <option value={20}>URI2</option>
                        <option value={30}>URI3</option>
                    </NativeSelect>
                </FormControl>
            </Box>

            <Box
                component="form"
                sx={{display: 'flex', justifyContent: 'center', marginTop: '20px',
                    '& .MuiTextField-root': { m: 1, width: '1000px' },
                }}
                noValidate
                autoComplete="off"
            >      
                <div>
                    <TextField
                        sx={{ backgroundColor: '#ebefff', border: '1px solid #111927' }}
                        id="standard-multiline-flexible"
                        label="Turtle editor"
                        multiline
                        rows={15}
                        variant="filled"
                    />        
                </div>
            </Box>

            <div className='editButtonContainer'>               
                <Button >Edit Generic Fragment</Button>                                            
            </div>   
        </div>
    )
}

export default GenericFragments;