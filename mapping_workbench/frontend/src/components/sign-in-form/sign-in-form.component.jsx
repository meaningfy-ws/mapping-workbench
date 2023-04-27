import { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

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
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleSubmit}>                              
                <FormInput
                    label="Email"
                    type="email" 
                    required 
                    onChange={handleChange} 
                    name="email" 
                    value={email} 
                />
                
                <FormInput
                    label="Password" 
                    type="password" 
                    required 
                    onChange={handleChange} 
                    name="password" 
                    value={password} 
                />
                <div className="buttons-container">            
                    <Button type="submit">Sign In</Button>
                    <Button type="button" buttonType='google' onClick={signInWithGoogle}>Google sign in</Button>
                </div>
            </form>
            {
            <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} message={errorMessage} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            }
            {
            <Snackbar open={openS} autoHideDuration={1000} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} message={successMessage} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
            }
        </div>
    )
};

export default SignInForm;