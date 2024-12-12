import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';

export const ChevronButton = ({isCurrent, onClick}) => {
    return <IconButton onClick={onClick}>
                        <ChevronRightIcon sx={{
                            transition: '0.2s linear',
                            ...(isCurrent && {transform: 'rotate(90deg)'}),
                        }}/>
                    </IconButton>
}