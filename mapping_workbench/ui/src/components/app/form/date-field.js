import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {useCallback} from "react";

export const FormDateField = (props) => {
    const {
        formik, name, label,
        required = false
    } = props;

    const handleDateFieldChange = useCallback(
        (date) => {
            formik.values[name] = date;
        },
        [formik]
    );

    return (<DatePicker
        format="yyyy-MM-dd"
        error={!!(formik.touched[name] && formik.errors[name])}
        fullWidth
        helperText={formik.touched[name] && formik.errors[name]}
        label={label}
        name={name}
        onBlur={formik.handleBlur}
        onChange={handleDateFieldChange}
        value={formik.values[name] || null}
        required={required}
    />)
}