import { useState } from 'react';
import Button from '../../../components/button/button.component';
import { Box, FormLabel, ListItem, MenuItem, Modal, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
//import { Drawer } from '@mui/material';
//import { List } from '@mui/material';
//import { TextField } from '@mui/material';
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
            label: 'CSV'
        }
        ];

    //const arrMenuOptions = ['PACKAGES', 'TEST DATA', 'RESOURCES', 'SHACL UT', 'SPARQL UT'];

    const sourceSchema = objTest.source_schema;
    const targetOntology = objTest.target_ontology;

const TedRdfMapping = () => {
const [open, setOpen] = useState(false);
//const [edit, setEdit] = useState(false);    

return (
    <div className="new-project-container">
        <div className='project-metadata-fields cardStyle'>
            <Card sx={{ minWidth: 275, bgcolor: '#eee' }}>
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
        <div className='cards-container'>
            <div className='project-source-scheme-fields cardStyle'>
                <Card sx={{ minWidth: 275, bgcolor: '#eee' }}>
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
            <div className='project-target-ontology-fields cardStyle'>
                <Card sx={{ minWidth: 275, bgcolor: '#eee' }}>
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
                    bgcolor: "white",
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
        
    </div>
);

}

export default TedRdfMapping;