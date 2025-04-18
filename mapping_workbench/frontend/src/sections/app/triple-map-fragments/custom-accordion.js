import Accordion from '@mui/material/Accordion';
import {useTheme} from '@mui/material/styles';

const CustomAccordion = ({children,...otherProps}) => {
    const theme = useTheme()
    return (
          <Accordion sx={{backgroundColor: theme.palette.background.default, borderRadius: '12px', m: "0 !important", mb: "16px !important"}}
                     defaultExpanded
                     {...otherProps}>
              {children}
          </Accordion>
    )
}

export default CustomAccordion