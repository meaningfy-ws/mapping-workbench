import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';

const CustomAccordionSummary = ({children}) => {
    return (
        <AccordionSummary sx={{
                flexDirection: 'row-reverse', gap: 1,
                "& .MuiAccordionSummary-content": {
                    alignItems: 'center', justifyContent: 'space-between', m:0
                }
            }}
                              expandIcon={<ExpandMoreIcon sx={{fontSize:30}}/>}>
            {children}
        </AccordionSummary>
    )
}

export default CustomAccordionSummary