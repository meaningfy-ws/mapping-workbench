import { useState } from 'react';
import { Box, Drawer, FormLabel, List, ListItemButton, ListItemIcon, ListItemText, Modal, Typography, TextField, ListItem } from '@mui/material';
// import CircularProgress from '@mui/material/CircularProgress';
import FlareIcon from '@mui/icons-material/Flare';
import BiotechIcon from '@mui/icons-material/Biotech';
import HubIcon from '@mui/icons-material/Hub';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HiveIcon from '@mui/icons-material/Hive';
import MapIcon from '@mui/icons-material/Map';

import Button from '../../../components/button/button.component';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import './conceptual-mapping.component.scss';

//const arrMenuOptions = ['Packages', 'Resources', 'Test Data', 'Shacl UT', 'Sparql UT'];

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'businessTitle',
      headerName: 'Business Title',
      width: 150,
      editable: true,
    },
    {
      field: 'businessDescription',
      headerName: 'Business Description',
      width: 300,
      editable: true,
    },
    {
      field: 'sourceXpath',
      headerName: 'Source Xpath',      
      width: 160,
      editable: true,
    },
    {
      field: 'targetClassPath',
      headerName: 'Target Class Path',                  
      width: 160,      
      editable: true,      
    },
    {
        field: 'targetPropertyPath',
        headerName: 'Target Property Path',                  
        width: 160,      
        editable: true,      
    }
  ];
  
  const rows = [
    { id: 1, businessTitle: 'Business Title 1', businessDescription: 'Business Description 1', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 1', targetPropertyPath: 'Target Property Path 1'},
    { id: 2, businessTitle: 'Business Title 2', businessDescription: 'Business Description 2', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 2', targetPropertyPath: 'Target Property Path 2'},
    { id: 3, businessTitle: 'Business Title 3', businessDescription: 'Business Description 3', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 3', targetPropertyPath: 'Target Property Path 3'},
    { id: 4, businessTitle: 'Business Title 4', businessDescription: 'Business Description 4', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 4', targetPropertyPath: 'Target Property Path 4'},
    { id: 5, businessTitle: 'Business Title 5', businessDescription: 'Business Description 5', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 5', targetPropertyPath: 'Target Property Path 5'},
    { id: 6, businessTitle: 'Business Title 6', businessDescription: 'Business Description 6', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 6', targetPropertyPath: 'Target Property Path 6'},
    { id: 7, businessTitle: 'Business Title 7', businessDescription: 'Business Description 7', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 7', targetPropertyPath: 'Target Property Path 7'},
    { id: 8, businessTitle: 'Business Title 8', businessDescription: 'Business Description 8', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 8', targetPropertyPath: 'Target Property Path 8'},
    { id: 9, businessTitle: 'Business Title 9', businessDescription: 'Business Description 9', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 9', targetPropertyPath: 'Target Property Path 9'},
    { id: 10, businessTitle: 'Business Title 10', businessDescription: 'Business Description 10', sourceXpath: 'Source Xpath 1', targetClassPath: 'Target Class Path 10', targetPropertyPath: 'Target Property Path 10'},  
  ];

const ConceptualMapping = () => {    

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

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
            case 'Conceptual Mapping':
                navigate("/project-management/conceptual-mapping");
                        
                break;
            default:
                break;                    
        }
    }

    return (

        <div className="mapping-workbench-projectManagement-packages">
            <h2 className='page-title'>Conceptual Mapping</h2>
            {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box> */}


            <Box sx={{ height: 'auto', width: '75%', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', backgroundColor: '#EBEFFF', borderRadius: '20px' }}>
                <DataGrid
                    sx={{borderRadius: '20px'}}
                    rows={rows}
                    columns={columns}                    
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>

            <div className='editButtonContainer'>    
                <Button onClick={() => setOpen(true) }>Create New Conceptual Mapping</Button>                            
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>               
            <Box 
                position="absolute"
                top="5%"
                left="20%"
                sx={{ 
                    bgcolor: "#ebefff",
                    minWidth: "60%",
                    minHeight: "90%",
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
                        New Package
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
                            <TextField style={{ minWidth: "300px" }} label="ID" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Business Title" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Business Description" multiline maxRows={5} variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Source XPath" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Target Class Path" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Target Property Path" variant='outlined' />
                        </ListItem>                        
                    </div>           
                    
                </Box>               

                
                <Box sx={{ 
                        display: "flex",
                        flexDirection: "row",
                        justifyContent:"space-between",                        
                        }}>
                    <Button onClick={() => setOpen(false)}>
                        Submit
                    </Button>                            
                    <Button onClick={() => setOpen(false)}>
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
                        <ListItemButton onClick={(e) => handleMenuClick('Packages')}>                                    
                            <ListItemIcon>
                                <FolderOpenIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px', fontWeight:'700' }}>
                                    Packages
                                </Typography>}/>
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Resources')}>                                    
                            <ListItemIcon>                                
                                <HubIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700' }}>
                                    Resources
                                </Typography>}/>       
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
                        <ListItemButton onClick={(e) => handleMenuClick('Test Data')}>                                    
                            <ListItemIcon>                               
                                <BiotechIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Test Data
                                </Typography>}/>
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Shacl UT')}>                                    
                            <ListItemIcon>                                
                                <ContentCutIcon style={{ color: "#9da4ae" }} />                                
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700' }}>
                                    Shacl UT
                                </Typography>}/>
                        </ListItemButton>
                        <ListItemButton onClick={(e) => handleMenuClick('Sparql UT')}>                                    
                            <ListItemIcon>                                
                                <FlareIcon style={{ color: "#9da4ae" }}/>
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Sparql UT
                                </Typography>}/>
                        </ListItemButton>
                        <br />
                        <ListItemButton onClick={(e) => handleMenuClick('Conceptual Mapping')}>                                    
                            <ListItemIcon>                                
                                <MapIcon style={{ color: "#9da4ae" }}/>
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Conceptual Mapping
                                </Typography>}/>
                        </ListItemButton>                            
                    </List>
                </Drawer>
            </Box>
                     
        </div>
    )
}

export default ConceptualMapping;