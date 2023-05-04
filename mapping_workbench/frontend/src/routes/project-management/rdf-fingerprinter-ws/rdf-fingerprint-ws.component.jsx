import { useState } from 'react';
import Button from '../../../components/button/button.component';
import { Box, FormLabel, ListItemButton, ListItemText, ListItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Drawer } from '@mui/material';
import { List } from '@mui/material';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';


import './rdf-fingerprint-ws.component.scss';

    const objTest = {
        "title": "rdf-fingerprint-ws",
        "description": "Description of rdfFingerprinterWs as mock data",
        "version": "1.1.0",
        "source_schema":{
        "title": "Schema Title Fingerprinter",
        "description": "Schema Description Fingerprinter...",
        "version": "2.0.0",
        "type": "xml/json"
        },
        "target_ontology":{
        "title": "ePO1",
        "description": "Description of ePO1...",
        "version": "3.1.2",
        "uri": "http://data.europa.eu/a4g/ontology"
        }
    };

    const arrMenuOptions = ['PACKAGES', 'TEST DATA', 'RESOURCES', 'SHACL UT', 'SPARQL UT'];

    const sourceSchema = objTest.source_schema;
    const targetOntology = objTest.target_ontology;

const RdfFingerPrintWS = () => {
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
                    {objTest.title}
            </div>
        </div>
        <div className="project-meta-field">
            <div className="project-meta-label">
                Description: 
            </div>
            <div className="project-meta-value">
                {objTest.description}
            </div>
        </div>
        <div className="project-meta-field">
            <div className="project-meta-label">
                Version: 
            </div>
            <div className="project-meta-value">
                {objTest.version}
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
                            Title: {sourceSchema.title}
                        </Typography>
                        <Typography variant="h6">
                            Description: {sourceSchema.description}
                        </Typography>
                        <Typography variant="h6">
                            Version: {sourceSchema.version}
                        </Typography>
                        <Typography variant="h6">
                            Type: {sourceSchema.type}
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
                                Title: {targetOntology.title}
                            </Typography>
                            <Typography variant="h6">
                                Description: {targetOntology.description}
                            </Typography>
                            <Typography variant="h6">
                                Version: {targetOntology.version}
                            </Typography>
                            <Typography variant="h6">
                                Uri: {targetOntology.uri}
                            </Typography>
                        </CardContent>
                    </Card>
            </div>

        </div>

        
        
    </div>
);

}

export default RdfFingerPrintWS;