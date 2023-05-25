import { useState } from 'react';
import { Avatar, Button, Box, Drawer, List, ListItemButton, ListItemText, ListItemAvatar, Typography, ListItemIcon, ListItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import './test-data.component.scss';

const arrMenuOptions = ['Packages', 'Resources', 'Test Data', 'Shacl UT', 'Sparql UT'];
let arrayOfUploadedFiles = ['TestData1', 'TestData2', 'TestData3', 'TestData4', 'TestData5'];
let testData1 = ['file1.xml', 'file2.xml', 'file3.xml', 'file4.xml', 'file5.xml'];
let testData2 = ['file1.xml', 'file2.xml'];
let testData3 = ['file1.xml', 'file2.xml', 'file3.xml'];
let testData4 = ['file1.xml', 'file2.xml', 'file3.xml', 'file4.xml'];
let testData5 = ['file1.xml'];

const TestData = () => {  
    
    //const [file, setFile] = useState();
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
            default:
                break;                    
        }
    }

    let handleDocumentClick = (fileElem) => {        

        switch(fileElem) {
            case 'TestData1':
                console.log('TestData1');                
                
                break;
            case 'TestData2':
                console.log('TestData2');                

                break;
            case 'TestData3':
                console.log('TestData3');               
                      
                break;
            case 'TestData4':
                console.log('TestData4');                
                            
                break;
            case 'TestData5':
                console.log('TestData5');                
                             
                break;    
            default:
                break;                      
        }
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

            <div className='resourceListBoxes'>

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
                            Upload test data
                        </Button>                    
                    </label>

                    <Button sx={{ display: "flex", marginTop: "20px" }} variant="contained" 
                            component="span">
                            <NoteAddIcon sx={{ marginRight: "10px" }} />
                            Create new test set
                        </Button>
                
                </Box>


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
                    {                    
                    testData1.map((listDoc) => (
                            <ListItem key={listDoc}>
                                <ListItemButton sx={{ display: "flex", justifyContent: "flex-start" }} onClick={(e)=>handleDocumentClick(listDoc)} >                                
                                    <ListItemText primary={listDoc} />
                                </ListItemButton>
                                <ListItemButton sx={{ display: "flex", justifyContent: "flex-end" }} onClick={(e) => handleDeleteClick(listDoc)}>                                
                                    <DeleteIcon />                                
                                </ListItemButton>
                            </ListItem>
                        )
                    )}                    
                    </List>               

                    
                
                </Box>

            </div>
            

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

export default TestData;