import { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

import FormInput from '../form-input/form-input.component';
import Button from "../button/button.component";

import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";
import './sign-up-form.styles.scss';

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {displayName, email, password, confirmPassword} = formFields;
    
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [openS, setOpenS] = useState(false);

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(
                email, 
                password
            );
                    
            await createUserDocumentFromAuth(user, {displayName});
            setOpenS(true);
            setSuccessMessage('User SIGNED UP successfull !');
            resetFormFields();
            setTimeout(function() {
                navigate("/project-management");
            }, 2000);            
        } catch (error) {
            switch(error.code) {
                case 'auth/email-already-in-use':
                    setOpen(true);
                    setErrorMessage("The email address is already in use");                    
                    break;
                case 'auth/invalid-email':
                    setOpen(true);
                    setErrorMessage("The email address is not valid");                    
                    break;
                case 'auth/operation-not-allowed':
                    setOpen(true);
                    setErrorMessage("Operation not allowed");                    
                    break;
                case 'auth/weak-password':
                    setOpen(true);
                    setErrorMessage("The password is too weak");                    
                    break;
                default:
                    setOpen(true);
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
            <h2>Don't have an account ?</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Display Name" 
                    type="text" 
                    required 
                    onChange={handleChange} 
                    name="displayName" 
                    value={displayName} 
                />
                
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

                
                <FormInput
                    label="Confirm Password"
                    type="password" 
                    required 
                    onChange={handleChange} 
                    name="confirmPassword" 
                    value={confirmPassword} 
                />
                <Button type="submit">Sign Up</Button>    
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

export default SignUpForm;