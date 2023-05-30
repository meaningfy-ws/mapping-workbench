import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '../../../components/button/button.component';
import { Box, Drawer, FormLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Modal, TextField } from '@mui/material';

import FlareIcon from '@mui/icons-material/Flare';
import BiotechIcon from '@mui/icons-material/Biotech';
import HubIcon from '@mui/icons-material/Hub';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HiveIcon from '@mui/icons-material/Hive';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



import './new-project.component.scss';
    

//const arrMenuOptions = ['Packages', 'Resources', 'Test Data', 'Shacl UT', 'Sparql UT'];
    
    const sourceSchemaTypes = [
        {
            value: '1',
            label: 'JSON'
        },
        {
            value: '2',
            label: 'XSD'
        }
        ];

const NewProject = () => {

    const [open, setOpen] = useState(false);    

    const navigate = useNavigate();

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

return (
    <div className="new-project-container">
        <div className='project-metadata-fields cardStyle'>
            <Card sx={{ minWidth: 275, bgcolor: '#ebefff' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        <b>Project</b>
                    </Typography>
                    <br/>
                    <Typography variant="h6">
                        <b>Title:</b> 
                    </Typography>
                    <Typography variant="h6">
                        <b>Description:</b> 
                    </Typography>
                    <Typography variant="h6">
                        <b>Version:</b> 
                    </Typography>
                </CardContent>                    
            </Card>
        </div>   
        
            <div className='project-metadata-fields cardStyle'>
                <Card sx={{ minWidth: 275, bgcolor: '#ebefff' }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            <b>Source Schema</b>
                        </Typography>
                        <br/>
                        <Typography variant="h6">
                            <b>Title:</b> 
                        </Typography>
                        <Typography variant="h6">
                            <b>Description:</b> 
                        </Typography>
                        <Typography variant="h6">
                            <b>Version:</b> 
                        </Typography>
                        <Typography variant="h6">
                            <b>Type:</b> 
                        </Typography>
                    </CardContent>                    
                </Card>
            </div>            
            <div className='project-metadata-fields cardStyle'>
                <Card sx={{ minWidth: 275, bgcolor: '#ebefff' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <b>Target Ontology</b>
                            </Typography>
                            <br/>
                            <Typography variant="h6">
                                <b>Title:</b> 
                            </Typography>
                            <Typography variant="h6">
                                <b>Description:</b> 
                            </Typography>
                            <Typography variant="h6">
                                <b>Version:</b> 
                            </Typography>
                            <Typography variant="h6">
                                <b>URI:</b> 
                            </Typography>
                        </CardContent>
                    </Card>
            </div>
        

        <div className='editButtonContainer'>    
            <Button onClick={() => setOpen(true) }>Create Project</Button>            
        </div>

        <Modal open={open} onClose={() => setOpen(false)}>               
            <Box 
                position="absolute"
                top="10%"
                left="10%"
                sx={{ 
                    bgcolor: "#ebefff",
                    minWidth: "80%",
                    minHeight: "80%",
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
                        Create Project
                    </Typography>
                </Box>

                

                <Box sx={{ 
                        display: "flex",
                        flexDirection: "row",
                        justifyContent:"space-between",                        
                        }}>
                        
                    <div className='editFormContainer'> 
                        <FormLabel sx={{
                                    marginLeft: "20px",                                
                                    marginBottom: "20px",
                                    fontWeight: "bold",
                                    fontSize: "20px"
                                    }}
                        >
                            Project
                        </FormLabel>   
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "220px" }} label="Title" variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "220px" }}  label="Description" multiline maxRows={5} variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "220px" }}  label="Version" variant='outlined' />
                        </ListItem>
                    </div>
                    

                    
                        
                    <div className='editFormContainer'> 
                        <FormLabel sx={{
                                    marginLeft: "20px",                                
                                    marginBottom: "20px",
                                    fontWeight: "bold",
                                    fontSize: "20px",
                                    width: "220px"
                                    }}
                        >
                            Source Schema
                        </FormLabel>   
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "220px" }}  label="Title" variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "220px" }}  label="Description" multiline maxRows={5} variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "220px" }}  label="Version" variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "220px" }}  label="Type" defaultValue="JSON" select variant='outlined'>
                                { sourceSchemaTypes.map((sourceSchemaTypes) => (
                                    <MenuItem key={sourceSchemaTypes.value} value={sourceSchemaTypes.value}>
                                        {sourceSchemaTypes.label}
                                  </MenuItem>
                                ))}
                            </TextField>
                        </ListItem>
                    </div>
                    

                    
                        
                    <div className='editFormContainer'> 
                        <FormLabel sx={{
                                    marginLeft: "20px",                                
                                    marginBottom: "20px",
                                    fontWeight: "bold",
                                    fontSize: "20px"
                                    }}
                        >
                            Target Ontology
                        </FormLabel>   
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "220px" }}  label="Title" variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "220px" }}  label="Description" multiline maxRows={5} variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "220px" }}  label="Version" variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "220px" }}  label="URI" variant='outlined' />
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
                    </List>
                </Drawer>
            </Box>        
    </div>
);

}

export default NewProject;