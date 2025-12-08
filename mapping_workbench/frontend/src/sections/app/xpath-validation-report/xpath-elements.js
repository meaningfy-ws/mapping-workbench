import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import IconButton from "@mui/material/IconButton";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CodeIcon from '@mui/icons-material/Code';

import {useDialog} from "src/hooks/use-dialog";
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import Divider from "@mui/material/Divider";


const XPathElements = (props) => {
    const {element_xpath, test_data_xpaths, ...other} = props;
    const elementsDialog = useDialog()
    const syntaxHighlighterTheme = useHighlighterTheme()

    const dialogTitle = "Found XPath Elements";


    const openElementsDialog = () => {
        elementsDialog.handleOpen({
            title: dialogTitle
        })
    }

    return (
        <>
            <IconButton
                onClick={openElementsDialog}
                sx={{p: 1}}
                title={dialogTitle}>
                <CodeIcon/>
            </IconButton>
            <Dialog
                open={elementsDialog.open}
                onClose={elementsDialog.handleClose}
                fullWidth
                maxWidth='xl'
            >
                <DialogTitle>
                    {elementsDialog.data?.title}
                    <Divider sx={{mt: 2}}/>
                </DialogTitle>
                <DialogContent>
                    <SyntaxHighlighter
                        language="sparql"
                        wrapLines
                        style={syntaxHighlighterTheme}
                        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                        {element_xpath}
                    </SyntaxHighlighter>
                    <Divider sx={{my: 3}}/>
                    {test_data_xpaths.map(test_data_xpath =>
                        <Box
                            key={test_data_xpath.test_data_oid}
                            value={test_data_xpath.test_data_id}
                        >
                            <Box sx={{pb: 1}}>
                                <Typography variant="h7">
                                    <b>{test_data_xpath.test_data_id}</b>
                                </Typography>
                            </Box>
                            <Box width="100%">
                                {test_data_xpath.xpaths.map(xpath =>
                                    <Box>
                                        <Box sx={{pt: 1}}>
                                            <Typography variant="h8">XPath:</Typography>
                                            <SyntaxHighlighter
                                                language="sparql"
                                                wrapLines
                                                style={syntaxHighlighterTheme}
                                                lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                                                {xpath.xpath}
                                            </SyntaxHighlighter>
                                        </Box>
                                        <Box sx={{pt: 1}}>
                                            <Typography variant="h8" sx={{pt: 2}}>Value:</Typography>
                                            <SyntaxHighlighter
                                                language="sparql"
                                                wrapLines
                                                style={syntaxHighlighterTheme}
                                                lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                                                {xpath.value}
                                            </SyntaxHighlighter>
                                        </Box>
                                        <Box sx={{pt: 1}}>
                                            <Typography variant="h8">Element:</Typography>
                                            <SyntaxHighlighter
                                                language="sparql"
                                                wrapLines
                                                style={syntaxHighlighterTheme}
                                                lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                                                {xpath.element}
                                            </SyntaxHighlighter>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                            <Divider sx={{my: 2}}/>
                        </Box>
                    )}

                </DialogContent>
            </Dialog>
        </>
    )
}

export default XPathElements