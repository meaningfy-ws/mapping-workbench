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
    const {element_id, element_xpath, test_data_xpaths, ...other} = props;
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
                    <Typography variant="h5">{element_id}</Typography>
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
                                <i>{test_data_xpath?.xpaths?.length || 0} result(s)</i>
                                <Divider sx={{my: 1}}/>
                                {test_data_xpath.xpaths.map((xpath, i) =>
                                    <Box sx={{pl: 2}}>
                                        <Typography variant="h8"><b>{i + 1}.</b></Typography>
                                        <Box sx={{pl: 4}}>
                                            <Box sx={{pt: 1}}>
                                                <Typography variant="h8">XPath:</Typography>
                                                <SyntaxHighlighter
                                                    language="sparql"
                                                    wrapLines
                                                    style={syntaxHighlighterTheme}
                                                    lineProps={{
                                                        style: {
                                                            wordBreak: 'break-all',
                                                            whiteSpace: 'pre-wrap'
                                                        }
                                                    }}>
                                                    {xpath.xpath}
                                                </SyntaxHighlighter>
                                            </Box>
                                            <Box sx={{pt: 1}}>
                                                <Typography variant="h8" sx={{pt: 2}}>Value:</Typography>
                                                <SyntaxHighlighter
                                                    language="sparql"
                                                    wrapLines
                                                    style={syntaxHighlighterTheme}
                                                    lineProps={{
                                                        style: {
                                                            wordBreak: 'break-all',
                                                            whiteSpace: 'pre-wrap'
                                                        }
                                                    }}>
                                                    {xpath.value}
                                                </SyntaxHighlighter>
                                            </Box>
                                            <Box sx={{pt: 1}}>
                                                <Typography variant="h8">Element:</Typography>
                                                <SyntaxHighlighter
                                                    language="sparql"
                                                    wrapLines
                                                    style={syntaxHighlighterTheme}
                                                    lineProps={{
                                                        style: {
                                                            wordBreak: 'break-all',
                                                            whiteSpace: 'pre-wrap'
                                                        }
                                                    }}>
                                                    {xpath.element}
                                                </SyntaxHighlighter>
                                            </Box>
                                            <Divider sx={{my: 1}}/>
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