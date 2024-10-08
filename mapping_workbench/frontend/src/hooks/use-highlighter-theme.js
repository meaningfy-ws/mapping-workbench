import {useTheme} from "@mui/material/styles";
import {codeStyle} from "../utils/code-style";

export const useHighlighterTheme = () => {
    const theme = useTheme()
    return theme.palette.mode === 'dark' ? codeStyle : undefined
}