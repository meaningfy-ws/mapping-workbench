import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';
import {styled} from '@mui/material/styles';
import getValidationColor from './validation-color';

export const LineProgressDouble = ({value, load, color, endColor}) => {
    const BorderLinearProgress = styled(LinearProgress)(({linecolor}) => ({
        height: 32,
        borderRadius: 16,
        [`&.${linearProgressClasses.root}`]: {
            backgroundColor: getValidationColor(endColor),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderBottomStartRadius: 16,
            borderTopStartRadius: 16,
            backgroundColor: getValidationColor(linecolor)
        },
    }));


    return (<BorderLinearProgress variant={load ? "indeterminate" : "determinate"}
                                  linecolor={color}
                                  endcolor={endColor}
                                  value={parseFloat(value)}/>
    )
};


export const LineProgress = ({value, load, color}) => {
    const BorderLinearProgress = styled(LinearProgress)(({theme, linecolor}) => ({
        height: 32,
        borderRadius: 16,
        [`&.${linearProgressClasses.root}`]: {
            backgroundColor: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
            }),
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderBottomStartRadius: 16,
            borderTopStartRadius: 16,
            backgroundColor: getValidationColor(linecolor),
        },
    }));

    return (
        <BorderLinearProgress variant={load ? "indeterminate" : "determinate"}
                              linecolor={color}
                              value={parseFloat(value)}/>
    )
}

