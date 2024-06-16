import TextField from "@mui/material/TextField";

export const FormTextField = (props) => {
    const {
        formik, name, label,
        type = 'text',
        required = false,
        ...other
    } = props;

    return (
        <TextField
            error={!!(formik.touched[name] && formik.errors[name])}
            fullWidth
            helperText={formik.touched[name] && formik.errors[name]}
            label={label}
            name={name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values?.[name]}
            required={required}
            type={type}
            {...other}
        />
    )
}