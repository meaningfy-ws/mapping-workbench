import Alert from "@mui/material/Alert";

export const TermValidityInfo = (props) => {
    const {item, ...other} = props;

    let severity = 'success';
    let info = ` is a known term`;
    let term = item.term
    if (!item.is_valid) {
        severity = 'error';
        info = ` is an unknown term`;
    }
    return (
        <Alert severity={severity}
               sx={{
                   my: 2
               }}
               {...other}
        >
            <b color="success">{term}</b>{info}
        </Alert>
    )
}