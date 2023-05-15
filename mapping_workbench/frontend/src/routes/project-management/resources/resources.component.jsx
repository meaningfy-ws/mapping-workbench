import { useState } from 'react';
import { Avatar, Button, Box, Drawer, List, ListItemButton, ListItemText, ListItemAvatar, Typography, ListItemIcon, ListItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import './resources.component.scss';

const arrMenuOptions = ['PACKAGES', 'TEST DATA', 'RESOURCES', 'SHACL UT', 'SPARQL UT'];
let arrayOfUploadedFiles = ['firstDoc.csv', 'secondDoc.csv', 'thirdDoc.json', 'fourthDoc.csv', 'fiftDoc.json', 'sixtDoc.csv', 'seventhDoc.csv'];

const Resources = () => {  
    
    //const [file, setFile] = useState();
    const navigate = useNavigate();  

    const handleMenuClick = (menuOption) => {
    
        switch(menuOption) {
            case 'RESOURCES':
                navigate("/project-management/resources");
                    
                break;
            case 'TEST DATA':
                navigate("/project-management/test-data");                
                
                break;
            case 'PACKAGES':
                navigate("/project-management/packages");                
                        
                break;    
            default:
                break;                    
        }
    }

    const handleDocumentClick = (listElem) => {
        console.log("List Element: ", listElem);
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
                    backgroundColor: "#F9F6EE",
                    padding: "20px",                    
                    marginLeft: "auto",
                    marginRight: "auto" 
                    }}
            >
                <List>
                    {arrayOfUploadedFiles.map((listElem) => (
                        <ListItem key={listElem}>
                            <ListItemButton sx={{ display: "flex", justifyContent: "flex-start" }} onClick={(e)=>handleDocumentClick(listElem)} >                                
                                <ListItemText primary={listElem} />
                            </ListItemButton>
                            <ListItemButton sx={{ display: "flex", justifyContent: "flex-end" }} onClick={(e) => handleDeleteClick(listElem)}>                                
                                <DeleteIcon />                                
                            </ListItemButton>
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
            
            

            <Box sx={{ overflow: 'auto', zIndex: '1', display: 'flex', justifyContent: 'center' }}>
                <Drawer
                    anchor='left' 
                    variant='permanent'
                    sx={{ 
                        justifyContent: 'center',
                        [`& .MuiDrawer-paper`]: {
                            display: 'flex', 
                            width: '200px',
                            alignItems: 'center',                            
                            backgroundColor: '#F9F6EE' 
                        }
                    }}                                        
                >
                    <List>
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