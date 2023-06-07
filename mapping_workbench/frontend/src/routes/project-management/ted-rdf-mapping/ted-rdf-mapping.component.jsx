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
import MapIcon from '@mui/icons-material/Map';
import SchemaIcon from '@mui/icons-material/Schema';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



import './ted-rdf-mapping.component.scss';

    const objTest = {
        "title": "ted-rdf-mapping",
        "description": "Transformation rules and other artefacts for the TED Semantic Web Services",
        "version": "1.0.0",
        "source_schema":{
        "title": "Schema Title",
        "description": "Schema Description...",
        "version": "2.0.0",
        "type": "xml/json"
        },
        "target_ontology":{
        "title": "ePO",
        "description": "Description of ePO...",
        "version": "3.1.0",
        "uri": "http://data.europa.eu/a4g/ontology"
        }
    };

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

    // const arrMenuOptions = ['Packages', 'Resources', 'Test Data', 'Shacl UT', 'Sparql UT'];

    const sourceSchema = objTest.source_schema;
    const targetOntology = objTest.target_ontology;    

const TedRdfMapping = () => {

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
            case 'Conceptual Mapping':
                navigate("/project-management/conceptual-mapping");
                        
                break;
            case 'Triple Map Fragment Management':
                navigate("/project-management/triple-map-fragment-management/generic-fragments");
                                
                break;    
            default:
                break;                    
        }
    }

return (
    <div className="new-project-container">
        <div className='project-metadata-fields cardStyle'>
            <Card sx={{ minWidth: 500, bgcolor: '#EBEFFF' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        <b>Project</b>
                    </Typography>
                    <br/>
                    <Typography variant="h6">
                        <b>Title:</b> {objTest.title}
                    </Typography>
                    <Typography variant="h6">
                        <b>Description:</b> {objTest.description}
                    </Typography>
                    <Typography variant="h6">
                        <b>Version:</b> {objTest.version}
                    </Typography>
                </CardContent>                    
            </Card>
        </div>    
        
        <div className='project-metadata-fields cardStyle'>
            <Card sx={{ minWidth: 500, bgcolor: '#EBEFFF' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        <b>Source Schema</b>
                    </Typography>
                    <br/>
                    <Typography variant="h6">
                        <b>Title:</b> {sourceSchema.title}
                    </Typography>
                    <Typography variant="h6">
                        <b>Description:</b> {sourceSchema.description}
                    </Typography>
                    <Typography variant="h6">
                        <b>Version:</b> {sourceSchema.version}
                    </Typography>
                    <Typography variant="h6">
                        <b>Type:</b> {sourceSchema.type}
                    </Typography>
                </CardContent>                    
            </Card>
        </div>

        <div className='project-metadata-fields cardStyle'>
            <Card sx={{ minWidth: 500, bgcolor: '#EBEFFF' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        <b>Target Ontology</b>
                    </Typography>
                    <br/>
                    <Typography variant="h6">
                        <b>Title:</b> {targetOntology.title}
                    </Typography>
                    <Typography variant="h6">
                        <b>Description:</b> {targetOntology.description}
                    </Typography>
                    <Typography variant="h6">
                        <b>Version:</b> {targetOntology.version}
                    </Typography>
                    <Typography variant="h6">
                        <b>URI:</b> {targetOntology.uri}
                    </Typography>
                </CardContent>
            </Card>
        </div>
        

        <div className='editButtonContainer'>    
            <Button onClick={() => setOpen(true) }>Edit Project</Button>            
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
                        Edit Project
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
                        <ListItemButton onClick={(e) => handleMenuClick('Triple Map Fragment Management')}>                                    
                            <ListItemIcon>                                
                                <SchemaIcon style={{ color: "#9da4ae" }}/>
                            </ListItemIcon>                                                                    
                            <ListItemText disableTypography primary={
                                <Typography variant="body1" style={{fontSize: '18px',fontWeight:'700'}}>
                                    Triple Map Fragment Management
                                </Typography>}/>
                        </ListItemButton>                            
                    </List>
                </Drawer>
            </Box>
        
    </div>
);

}

export default TedRdfMapping;