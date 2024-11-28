import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {useHighlighterTheme} from '../../../../hooks/use-highlighter-theme';

export const XqueryDialog = ({open, handleClose, item}) => {
    const syntaxHighlighterTheme = useHighlighterTheme()

    console.log(item)

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='md'
        >
            <DialogTitle>
                XPath Condition
            </DialogTitle>
            <DialogContent>
                <SyntaxHighlighter
                    language="xquery"
                    wrapLines
                    style={syntaxHighlighterTheme}
                    lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                    {item}
                </SyntaxHighlighter>
            </DialogContent>
        </Dialog>
    )
}