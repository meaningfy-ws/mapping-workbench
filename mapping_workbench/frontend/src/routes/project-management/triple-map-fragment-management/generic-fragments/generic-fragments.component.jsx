import { Box, FormControl, InputLabel, NativeSelect, TextField } from '@mui/material';
import Code from '../../../../components/code/code.component';
import Button from '../../../../components/button/button.component';

import './generic-fragments.component.scss';

const JSCode = `const App = props => {
    return (
      <div>
        <h1> Prism JS </h1>
        <div>Awesome Syntax Highlighter</div>
      </div>
    );
  };
  `;

  const htmlCode = `
    <div>
      <h1> PrismJS Tutorial </h1>
      <p>
      Prism is a lightweight, extensible syntax highlighter, built with modern web standards in mind.
      </p>
    </div>
`;

const GenericFragments = () => {    
    
    

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
                    <Code code={JSCode} language="javascript" />
      <Code code={htmlCode} language="html" />        
                </div>
            </Box>

            <div className='editButtonContainer'>               
                <Button >Edit Generic Fragment</Button>                                            
            </div>   
        </div>
    )
}

export default GenericFragments;