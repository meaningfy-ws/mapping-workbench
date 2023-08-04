import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Box, Drawer, Tab, List, ListItemButton, ListItemIcon, ListItemText, Tabs, Typography } from '@mui/material';
import FlareIcon from '@mui/icons-material/Flare';
import BiotechIcon from '@mui/icons-material/Biotech';
import HubIcon from '@mui/icons-material/Hub';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HiveIcon from '@mui/icons-material/Hive';
import MapIcon from '@mui/icons-material/Map';
import SchemaIcon from '@mui/icons-material/Schema';

import { useNavigate } from "react-router-dom";

import './triple-map-fragment-management.component.scss';


const LinkTab = (props) => {
    const navigate = useNavigate();

    return (
      <Tab        
        component="a"
        onClick={(event) => {
          event.preventDefault();
         
            const tripleMapTab = event.target.innerText;

            switch(tripleMapTab) {
                case 'GENERIC FRAGMENTS':
                    navigate("/project-management/triple-map-fragment-management/generic-fragments");

                    break;
                case 'SPECIFIC FRAGMENTS':
                    navigate("/project-management/triple-map-fragment-management/specific-fragments");

                    break;
                default: 
                    navigate("/project-management/triple-map-fragment-management/generic-fragments");
                    
                    break;
            }

        }}
        {...props}
      />
    );
  }


const TripleMapFragManag = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
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
            case 'Conceptual Mapping':
                navigate("/project-management/conceptual-mapping");   
                        
                break;
            case 'Triple Map Fragment Management':
                navigate("/project-management/triple-map-fragment-management");
                
                break; 
            default:
                break;                    
        }
    }
    

    return (

        <div className="mapping-workbench-triple-map-frag-manag-container">
            <h2 className='page-title'>Triple Map Fragment Management</h2>


            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Tabs textColor='primary' indicatorColor='primary'  value={value} onChange={handleChange} aria-label="nav tabs example">
                    <LinkTab label="Generic Fragments" href="triple-map-fragment-management/generic-fragments" />
                    <LinkTab label="Specific Fragments" href="triple-map-fragment-management/specific-fragments" />        
                </Tabs>
            </Box>


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

            <Outlet />            
        </div>
    )
}

export default TripleMapFragManag;