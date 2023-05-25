import { useState } from 'react';
import { Box, Divider, Drawer, FormLabel, List, ListItemButton, ListItemText, Modal, Typography, TextField, ListItem } from '@mui/material';
import Button from '../../../components/button/button.component';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import './packages.component.scss';

const arrMenuOptions = ['Packages', 'Resources', 'Test Data', 'Shacl UT', 'Sparql UT'];

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'packageTitle',
      headerName: 'Package title',
      width: 150,
      editable: true,
    },
    {
      field: 'packageDescription',
      headerName: 'Package description',
      width: 150,
      editable: true,
    },
    {
      field: 'formType',
      headerName: 'Form type(s)',
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'minDate',
      headerName: 'Min date',
      type: 'date',            
      width: 160,
      valueGetter: ({ value }) => value && new Date(value),
      editable: true,      
    },
    {
        field: 'maxDate',
        headerName: 'Max date',
        type: 'date',            
        width: 160,
        valueGetter: ({ value }) => value && new Date(value),
        editable: true,      
    },
    {
        field: 'minVersion',
        headerName: 'Min version',
        width: 150,
        editable: true,
    },
    {
        field: 'maxVersion',
        headerName: 'Max version',
        width: 150,
        editable: true,
    },
  ];
  
  const rows = [
    { id: 1, packageDescription: 'Des03', packageTitle: 'F03', formType: 35, minDate: 19811125, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 2, packageDescription: 'Des02', packageTitle: 'F02', formType: 42, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 3, packageDescription: 'Des01', packageTitle: 'F01', formType: 45, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 4, packageDescription: 'Des04', packageTitle: 'F04', formType: 16, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 5, packageDescription: 'Des05', packageTitle: 'F05', formType: 11, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 6, packageDescription: 'Des06', packageTitle: 'F06', formType: 150, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 7, packageDescription: 'Des07', packageTitle: 'F07', formType: 44, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 8, packageDescription: 'Des08', packageTitle: 'F08', formType: 36, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
    { id: 9, packageDescription: 'Des09', packageTitle: 'F09', formType: 65, minDate: 25041990, maxDate: 30041999, minVersion: 'R2.08.55', maxVersion: 'R2.09.66' },
  ];

const Packages = () => {    

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
            default:
                break;                    
        }
    }

    return (

        <div className="mapping-workbench-projectManagement-packages">
            <h2 className='page-title'>Packages</h2>


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
                <Button onClick={() => setOpen(true) }>Create New Package</Button>
                <Button >Select packages</Button>            
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
                            <TextField style={{ minWidth: "300px" }} label="Package title" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Package description" multiline maxRows={5} variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Form type(s)" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Min date" variant='outlined' />
                        </ListItem>
                        <ListItem>                                                   
                            <TextField style={{ minWidth: "300px" }} label="Max date" variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "300px" }}  label="Min version" multiline maxRows={5} variant='outlined' />
                        </ListItem>
                        <ListItem >                       
                            <TextField style={{ minWidth: "300px" }}  label="Max version" variant='outlined' />
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

export default Packages;