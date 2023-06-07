import Button from '../../../../components/button/button.component';
import { Box, FormControl, InputLabel, NativeSelect, TextField } from '@mui/material';

import './specific-fragments.component.scss';

const SpecificFragments = () => {        

    return (
        <div className="mapping-workbench-specific-fragments-container">
            <h3 className='page-title'>Specific Fragments</h3>

            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: '20px' }}>
                <FormControl>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Mapping Package
                    </InputLabel>
                    <NativeSelect
                        sx={{ minWidth: '300px' }}
                        defaultValue={10}
                        inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                        }}
                    >
                        <option value={10}>package_F01</option>
                        <option value={20}>package_F02</option>
                        <option value={30}>package_F03</option>
                        <option value={30}>package_F04</option>
                        <option value={30}>package_F05</option>
                    </NativeSelect>
                </FormControl>
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
                        <option value={30}>URI4</option>
                        <option value={30}>URI5</option>
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
                <Button >Edit Specific Fragment</Button>                            
            </div>               
        </div>
    )
}

export default SpecificFragments;