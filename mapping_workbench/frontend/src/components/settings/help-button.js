import {useEffect} from "react";
import PropTypes from 'prop-types';
import {useTheme} from "@mui/material/styles";

export const HelpButton = (props) => {
    const theme = useTheme()
    useEffect(() => {
        //customize button here
    }, [theme]);
};

HelpButton.propTypes = {
    onClick: PropTypes.func
};
