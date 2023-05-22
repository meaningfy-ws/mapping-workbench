import { useState } from 'react';
import { Button, Box, Divider, Drawer, FormLabel, List, ListItemButton, ListItemText, Modal, TextField, Typography, ListItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import './resources.component.scss';

const arrMenuOptions = ['Packages', 'Resources', 'Test Data', 'Shacl UT', 'Sparql UT'];
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
    },
    {
        id: 6,
        name: 'sixtDoc.csv',
        description: 'This is the description for sixtDoc.csv'
    },
    {
        id: 7,
        name: 'seventhDoc.csv',
        description: 'This is the description for firstDoc.csv'
    }   
];



const Resources = () => {  
    
    //const [file, setFile] = useState();
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

            <h2 className='page-title'>Resources</h2>

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
                        Upload resource file
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
                        Resource Details
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

            <Box sx={{ overflow: 'auto', zIndex: '1', display: 'flex', justifyContent: 'center' }}>
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
                        <Typography variant='body1' style={{
                                                        fontSize: '18px',
                                                        fontWeight:'700',
                                                        borderBottom: '1px solid #9da4ae' 
                                                    }}>
                            Project Management
                        </Typography>
                        <br/>
                        {
                            arrMenuOptions.map((elm) => (
                                <ListItemButton key={elm}>
                                <ListItemText 
                                    
                                    disableTypography 
                                    primary={<Typography 
                                                variant="body1" 
                                                style={{
                                                        fontSize: '18px',
                                                        fontWeight:'700' 
                                                    }}
                                            >
                                                {elm}
                                            </Typography>} onClick={(e) => handleMenuClick(elm)} />
                                
        
                                </ListItemButton>
                            ))
                        }
                    </List>
                </Drawer>
            </Box>
                     
        </div>
    )
}

export default Resources;