import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Box, Chip, Divider, Drawer, FormLabel, FormControl, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Modal, OutlinedInput, Select, TextField, Typography, ListItem } from '@mui/material';
import FlareIcon from '@mui/icons-material/Flare';
import BiotechIcon from '@mui/icons-material/Biotech';
import HubIcon from '@mui/icons-material/Hub';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HiveIcon from '@mui/icons-material/Hive';
import { useNavigate } from "react-router-dom";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import './test-data.component.scss';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,      
    },
  },
};

//const arrMenuOptions = ['Packages', 'Resources', 'Test Data', 'Shacl UT', 'Sparql UT'];

let arrayOfUploadedFiles = [
    {
        id: 1,
        name: 'firstDoc.csv',
        description: 'This is the description for firstDoc.csv'
    },
    {
        id: 2,
        name: 'secondDoc.csv',
        description: 'This is the description for secondDoc.csv'
    },
    {
        id: 3,
        name: 'thirdDoc.json',
        description: 'This is the description for thirdDoc.json'
    },
    {
        id: 4,
        name: 'fourthDoc.csv',
        description: 'This is the description for fourthDoc.csv'
    },
    {
        id: 5,
        name: 'fiftDoc.json',
        description: 'This is the description for fiftDoc.json'
    }       
];

const testCollections = [ 'Collection1', 'Collection2', 'Collection3', 'Collection4', 'Collection5', 'Collection6', 'Collection7', 'Collection8', 'Collection9', 'Collection10' ];

function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const TestData = () => {  
    
    //const [file, setFile] = useState();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const [personName, setPersonName] = useState([]);

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setPersonName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    
        
      };

    const handleMenuClick = (menuOption) => {
    
        switch(menuOption) {
            case 'Resources':
                navigate("/project-management/resources");
                    
                break;
            case 'Test Data':
                navigate("/project-management/test-data");                
                
                break;
            case 'Packages':
                navigate("/project-management/packages");
                
                break;
            case 'Shacl UT':
                navigate("/project-management/shacl");
                    
                break;
            case 'Sparql UT':
                navigate("/project-management/sparql");
                
                break;
            case 'Target Ontology':
                navigate("/project-management/target-ontology");
                    
                break;    
            default:
                break;                    
        }
    }

    const handleDocumentClick = (listElem) => {
        console.log("List Element: ", listElem);
        setOpen(true);
    }

    const handleDeleteClick = (listElem) => {
        console.log("List Element for deletion:", listElem );       
    }

    const handleFileChange = (e) => {
        if (e.target.files) {
            console.log("FILE: ", e.target.files);
          //setFile(e.target.files[0]);
        }
    }

    // const handleUploadClick = () => {
    //     if (!file) {
    //       return;
    //     }    
        
    //     fetch('https://httpbin.org/post', {
    //       method: 'POST',
    //       body: file,
    //       // Set headers manually for single file upload
    //       headers: {
    //         'content-type': file.type,
    //         'content-length': `${file.size}`, // Headers need to be a string
    //       },
    //     })
    //       .then((res) => res.json())
    //       .then((data) => console.log(data))
    //       .catch((err) => console.error(err));
    // }

    return (

        <div className="mapping-workbench-resources">

            <h2 className='page-title'>Test Data</h2>

            <FormControl sx={{ m: 1, width: 350, marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', marginBottom: '40px' }}>
                <InputLabel id="demo-multiple-chip-label">Collections</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Collection" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                MenuProps={MenuProps}
                >
          {testCollections.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

            <Box sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: "20px",
                    backgroundColor: "#ebefff",
                    padding: "20px",                    
                    marginLeft: "auto",
                    marginRight: "auto",
                    minWidth: "50%",
                    marginBottom: "50px" 
                    }}
            >
                <List>
                    {arrayOfUploadedFiles.map((listElem) => (
                        <ListItem sx={{ border: "1px solid #9da4ae", borderRadius: '20px', marginTop: '10px'}} key={listElem.id}>
                            <ListItemButton sx={{ display: "flex", justifyContent: "flex-start", flexDirection: "column" }} onClick={(e)=>handleDocumentClick(listElem)} >                                
                                <ListItemText primary={listElem.name} /> 
                                <ListItemText secondary={listElem.description} />                               
                            </ListItemButton>                               
                            
                            <ListItemButton sx={{ display: "flex", justifyContent: "flex-end" }} onClick={(e) => handleDeleteClick(listElem)}>                                
                                <DeleteIcon />                                
                            </ListItemButton>
                            <Divider/>                            
                        </ListItem>
                        
                    ))}                    
                </List>

                
                <input
                    accept=".csv, .json"                
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">                    
                    <Button 
                        sx={{ display: "flex" }}
                        variant="contained" 
                        component="span"                       
                    >
                        <UploadFileIcon sx={{ marginRight: "10px" }} />
                        Upload test data file
                    </Button>
                </label>
            
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>               
            <Box 
                position="absolute"
                top="25%"
                left="30%"
                sx={{ 
                    bgcolor: "#ebefff",
                    minWidth: "40%",
                    minHeight: "50%",
                    borderRadius: "20px",
                    padding: "60px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"                    
                }}
            >
                <Box>
                    <Typography sx={{
                        marginTop: "20px",
                        fontSize: "24px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",                                    
                    }}
                    >
                        Test Data File Details
                    </Typography>
                </Box>

                

                <Box sx={{ 
                        display: "flex",                        
                        justifyContent:"center",                        
                        }}>
                        
                    <div className='editFormContainer'> 
                        <FormLabel sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginLeft: "20px",                                
                                    marginBottom: "20px",
                                    fontWeight: "bold",
                                    fontSize: "20px"
                                    }}
                        >
                            
                        </FormLabel>   
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Resource name" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Resource description" multiline maxRows={5} variant='outlined' />
                        </ListItem>                        
                    </div>           
                    
                </Box>               

                
                <Box sx={{ 
                        display: "flex",
                        flexDirection: "row",
                        justifyContent:"space-between",                        
                        }}>
                    <Button className='button-container' onClick={() => setOpen(false)}>
                        Submit
                    </Button>                            
                    <Button className='button-container' onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </Box>

            </Box>
            
        </Modal>           

        <Box sx={{ overflow: 'auto', zIndex: '1' }}>
            <Drawer
                    anchor='left' 
                    variant='permanent'
                    sx={{ 
                        justifyContent: 'center',
                        [`& .MuiDrawer-paper`]: {
                            display: 'flex', 
                            width: '279px',
                            alignItems: 'center',                            
                            color: '#9DA4AE',                            
                            backgroundColor: '#111927' 
                        }
                    }}                    
                >                    
                    <List>
                        <Typography variant='body1' style={{fontSize: '18px', fontWeight:'700', borderBottom: '1px solid #9da4ae' }}>
                            Project Management
                        </Typography>
                        <br/>
                        <ListItemButton  onClick={(e) => handleMenuClick('Packages')}>                                    
                            <ListItemIcon>
                                <FolderOpenIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px', fontWeight:'700' }}>
                                    Packages
                                </Typography>} />
                        </ListItemButton >
                        <ListItemButton  onClick={(e) => handleMenuClick('Resources')}>                                    
                            <ListItemIcon>                                
                                <HubIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700' }}>
                                    Resources
                                </Typography>} />       
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Target Ontology')}>                                    
                            <ListItemIcon>                                
                                <HiveIcon style={{ color: "#9da4ae" }} />                               
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700' }}>
                                    Target Ontology
                                </Typography>}/>       
                        </ListItemButton>
                        <ListItemButton  onClick={(e) => handleMenuClick('Test Data')}>                                    
                            <ListItemIcon>                               
                                <BiotechIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Test Data
                                </Typography>} />
                        </ListItemButton>
                        <ListItemButton  onClick={(e) => handleMenuClick('Shacl UT')}>                                    
                            <ListItemIcon>                                
                                <ContentCutIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700' }}>
                                    Shacl UT
                                </Typography>}/>
                        </ListItemButton>
                        <ListItemButton  onClick={(e) => handleMenuClick('Sparql UT')}>                                    
                            <ListItemIcon>                                
                                <FlareIcon style={{ color: "#9da4ae" }}/>
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Sparql UT
                                </Typography>}/>
                        </ListItemButton>                            
                    </List>
                </Drawer>
            </Box>
                     
        </div>
    )
}

export default TestData;