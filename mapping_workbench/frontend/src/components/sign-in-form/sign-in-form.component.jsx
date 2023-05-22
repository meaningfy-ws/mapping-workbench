import { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Card, CardContent } from '@mui/material';

import FormInput from '../form-input/form-input.component';
import Button from "../button/button.component";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { signInWithGooglePopup,
         signInAuthUserWithEmailAndPassword 
        } from "../../utils/firebase/firebase.utils";
import './sign-in-form.styles.scss';

const defaultFormFields = {
    email: '',
    password: ''    
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const SignInForm = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [openS, setOpenS] = useState(false);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    const navigate = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        setOpenS(false);
    }

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const signInWithGoogle = async () => {
        await signInWithGooglePopup();        
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await signInAuthUserWithEmailAndPassword(
                email,
                password
                );
            setOpenS(true);
            setSuccessMessage('User SIGNED IN successfull !');
            resetFormFields();
            setTimeout(function() {
                navigate("/project-management");
            }, 2000);                        
        } catch (error) {
            switch(error.code) {
                case 'auth/wrong-password':
                    //alert('Incorrect password');
                    setOpen(true);
                    setErrorMessage('Incorrect password');
                    break;
                case 'auth/user-not-found':
                    setOpen(true);
                    setErrorMessage('No user associated with this email');
                    //alert('No user associated with this email');
                    break;
                default:
                    setErrorMessage(error);                    
            }
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        
        setFormFields({...formFields, [name]: value});
    }

    return (
        <div className="sign-up-container">            

            <Card sx={{ minWidth: 500, bgcolor: 'white', borderRadius: "20px" }}>
                <CardContent>
                    <h2>Log in</h2>

                    <p>
                        Don't have an account ?

                        <a className="registerLink" href="/auth"> Register </a>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <TextField onChange={handleChange} style={{ width: "100%", marginTop: "20px", marginBottom: "10px" }} label="Email adress" type="email" name="email" value={email} required variant='outlined' />                                                                   
                        <TextField onChange={handleChange} style={{ width: "100%", marginTop: "10px", marginBottom: "20px" }} label="Password" type="password" name="password" value={password} required variant='outlined' />
                

                        <div className="buttons-container">            
                            <Button sx={{ width: '100%' }} type="submit">Log In</Button>                    
                        </div>
                    </form>
                </CardContent>                    
            </Card>

                
            
            {
            <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} message={errorMessage} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            }
            {
            <Snackbar open={openS} autoHideDuration={1000} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} message={successMessage} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
            }
        </div>
    )
};

export default SignInForm;