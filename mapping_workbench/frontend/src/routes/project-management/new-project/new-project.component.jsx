import { useState } from 'react';
import Button from '../../../components/button/button.component';
import { Box, FormLabel, ListItemButton, ListItemText, ListItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Drawer } from '@mui/material';
import { List } from '@mui/material';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';


import './new-project.component.scss'; 

    
    const arrMenuOptions = ['PACKAGES', 'TEST DATA', 'RESOURCES', 'SHACL UT', 'SPARQL UT'];

    

const NewProject = () => {
const [open, setOpen] = useState(false);
const [edit, setEdit] = useState(false);    

return (
    <div className="new-project-container">

        <Box>
            <div className='drawerButtons'>
                <Button
                    onClick={() => setOpen(true)}>
                        workbench menu
                </Button>
                <Button
                    onClick={() => setEdit(true)}>
                        edit
                </Button>
            </div>

            <Drawer
                anchor='right' 
                open={edit}
                sx={{ justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}
                onClose={() => setEdit(false)}
            >
                <FormLabel sx={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginBottom: "20px",
                                fontWeight: "bold"
                                }}
                >
                    Main Project Metadata
                </FormLabel>
                <div className='editFormContainer'>    
                    <ListItem >                       
                        <TextField placeholder="Title" variant='standard' />
                    </ListItem>
                    <ListItem >                       
                        <TextField placeholder="Description" variant='standard' />
                    </ListItem>
                    <ListItem >                       
                        <TextField placeholder="Version" variant='standard' />
                    </ListItem>
                </div>

                <FormLabel sx={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginBottom: "20px",
                                marginTop: "20px",
                                fontWeight: "bold"
                                }}
                >
                    Source Schema
                </FormLabel>
                <div className='editFormContainer'>    
                    <ListItem >                       
                        <TextField placeholder="Title" variant='standard' />
                    </ListItem>
                    <ListItem >                       
                        <TextField placeholder="Description" variant='standard' />
                    </ListItem>
                    <ListItem >                       
                        <TextField placeholder="Version" variant='standard' />
                    </ListItem>
                    <ListItem >                       
                        <TextField placeholder="Type" variant='standard' />
                    </ListItem>
                </div>

                <FormLabel sx={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginBottom: "20px",
                                marginTop: "20px",
                                fontWeight: "bold"
                                }}
                >
                    Target Ontology
                </FormLabel>
                <div className='editFormContainer'>    
                    <ListItem >                       
                        <TextField placeholder="Title" variant='standard' />
                    </ListItem>
                    <ListItem >                       
                        <TextField placeholder="Description" variant='standard' />
                    </ListItem>
                    <ListItem >                       
                        <TextField placeholder="Version" variant='standard' />
                    </ListItem>
                    <ListItem >                       
                        <TextField placeholder="Uri" variant='standard' />
                    </ListItem>
                </div>
                
                <Box 
                    sx={{ 
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: '20px' 
                    }}
                >
                    <Button 
                        type='submit'
                        onClick={() => setEdit(false)}
                    >
                        Submit
                    </Button>
                </Box>
                        
                
            </Drawer>

            <Drawer
                anchor='left' 
                open={open}
                sx={{ justifyContent: 'center' }}
                onClose={() => setOpen(false)}>
                <List>
                    {
                        arrMenuOptions.map((elm) => (
                            <ListItemButton onClick={() => setOpen(false)}>
                                <ListItemText primary={elm} />
                            </ListItemButton>
                        ))
                    }
                </List>
            </Drawer>
        </Box>
                
        <div className="project-meta-field">
            <div className="project-meta-label">
                Title: 
            </div>
            <div className="project-meta-value">
                    
            </div>
        </div>
        <div className="project-meta-field">
            <div className="project-meta-label">
                Description: 
            </div>
            <div className="project-meta-value">
                
            </div>
        </div>
        <div className="project-meta-field">
            <div className="project-meta-label">
                Version: 
            </div>
            <div className="project-meta-value">
                
            </div>
        </div>
      
        <div className='cards-container'>

            <div className='project-source-scheme-fields cardStyle'>
                <Card sx={{ minWidth: 275, bgcolor: '#eee' }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            <b>Source Schema</b>
                        </Typography>
                        <Typography variant="h6">
                            Title: 
                        </Typography>
                        <Typography variant="h6">
                            Description: 
                        </Typography>
                        <Typography variant="h6">
                            Version: 
                        </Typography>
                        <Typography variant="h6">
                            Type: 
                        </Typography>
                    </CardContent>                    
                </Card>
            </div>
            
            <div className='project-target-ontology-fields cardStyle'>
                <Card sx={{ minWidth: 275, bgcolor: '#eee' }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <b>Target Ontology</b>
                            </Typography>
                            <Typography variant="h6">
                                Title: 
                            </Typography>
                            <Typography variant="h6">
                                Description: 
                            </Typography>
                            <Typography variant="h6">
                                Version: 
                            </Typography>
                            <Typography variant="h6">
                                Uri: 
                            </Typography>
                        </CardContent>
                    </Card>
            </div>

        </div>

        
        
    </div>
);

}

export default NewProject;