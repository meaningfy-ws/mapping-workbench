import { Fragment, useContext, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import { ReactComponent as MappingWorkbench } from '../../assets/mapping-workbench-logo.svg';
import { UserContext } from "../../contexts/user.context";

import { signOutUser } from '../../utils/firebase/firebase.utils';
//import { getAuth } from "firebase/auth";
import './navigation.component.scss';

const Navigation = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    //const auth = getAuth();

    //const user = auth.currentUser;
    //console.log('USER:', auth);

    //console.log('currentUser:', currentUser);

    const CustomLink = ({to, children }) => {
        //const resolvedPath = useResolvedPath(to);
        //const isActive = useMatch({ path: resolvedPath.pathname, end: true});

        return (
            <Link className={'nav-link'} to={to}>
                {children}
            </Link>
        )
    }
    
    const signOutUserAndRedirect = () => {
        signOutUser();
        navigate("/auth");
    }

    const handleChange = (e) => {
        setInput(e.target.value);
        switch (e.target.value) {
            case 'ted-rdf-mapping':
                console.log('ted-rdf-mapping');
                break;
            case 'rdf-fingerprinter-ws':
                console.log('rdf-fingerprinter-ws');
                break;
            case 'mapping-workbench':
                console.log('mapping-workbench');
                break;
            case 'CREATE NEW PROJECT':
                navigate("/project-management/new-project");
                //console.log('CREATE NEW PROJECT');
                break;    
            default:
                console.log('switch default reached!')    
        }
    }

    return (
      <Fragment>
        <div className="navigation">
            <CustomLink className="logo-container" to='/'>
                <MappingWorkbench className='logo' />
            </CustomLink> 
            <div className="nav-links-container">
                    {
                        currentUser ? (
                            <div className="startMenu">
                                <FormControl sx={{ m: 1, minWidth: 203 }} size="small">
                                    <InputLabel id='start-menu-label'>Projects</InputLabel>
                                    <Select
                                    labelId="start-menu-label"
                                    id="start-menu"
                                    value={input}
                                    label="Projects"
                                    onChange={handleChange}
                                    autoWidth
                                    >                                
                                        <MenuItem value={''}></MenuItem>
                                        <MenuItem value={'ted-rdf-mapping'}> ted-rdf-mapping </MenuItem>
                                        <MenuItem value={'rdf-fingerprinter-ws'}> rdf-fingerprinter-ws </MenuItem>
                                        <MenuItem value={'mapping-workbench'}> mapping-workbench </MenuItem>
                                        <br className="break-line"/>
                                        <MenuItem value={'CREATE NEW PROJECT'}> CREATE NEW PROJECT </MenuItem>
                                    </Select>
                                </FormControl>                    
                            </div>
                        ):( '' )
                    }
                    {
                        currentUser ? (
                            <span className="nav-link" onClick={signOutUserAndRedirect}> SIGN OUT </span>
                            ) : (
                            <CustomLink className='nav-link' to='/auth'>
                                SIGN IN
                            </CustomLink>)
                        
                    }
            </div> 
        </div>
        <Outlet />
      </Fragment>
    )
  }

  export default Navigation;