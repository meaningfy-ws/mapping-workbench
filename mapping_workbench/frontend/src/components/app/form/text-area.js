import TextField from "@mui/material/TextField";


export const FormTextArea = (props) => {
    const {
        formik, name, label,
        required = false,
        ...other
    } = props;

    return (<TextField
        error={!!(formik.touched[name] && formik.errors[name])}
        minRows={5}
        multiline
        fullWidth
        helperText={formik.touched[name] && formik.errors[name]}
        label={label}
        name={name}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values[name]}
        required={required}
        {...other}
    />)
}