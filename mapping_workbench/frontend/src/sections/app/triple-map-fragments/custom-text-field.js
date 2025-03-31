import Typography from '@mui/material/Typography';
import {FormTextField} from '../../../components/app/form/text-field';

const CustomTextField = (props) => {
    const {label, ...others} = props
    return (
        <>
            {label && <Typography sx={{pb: 1}}>{label}</Typography>}
            <FormTextField variant='outlined'
                           sx={{
                               "& .MuiOutlinedInput-root": {
                                   borderRadius: "12px",
                                   backgroundColor: "white",
                                   height: 40
                               }
                           }}
                           {...others}/>
        </>
    )
}

export default CustomTextField