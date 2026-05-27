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
import {LocalHighlighter} from "../../components/local-highlighter";
import {paths} from "../../../paths";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Tooltip from "@mui/material/Tooltip";
import {useState} from "react";
import Switch from "@mui/material/Switch";


const XPathElements = (props) => {
    const {
        element_id,
        element_xpath,
        test_data_xpaths,
        test_datas = [], // <-- Accept a list of test_datas
        sparql_query = null,
        sparql_query_results = null,
        ...other
    } = props;
    const [hideNamespaces, setHideNamespaces] = useState(true);

    const stripNamespaces = (xml) => {
        // Remove xmlns declarations
        let noXmlns = xml.replace(/\s+xmlns(:\w+)?="[^"]*"/g, '');
        // Remove prefixes from tags (e.g., cbc:Tag -> Tag)
        noXmlns = noXmlns.replace(/<\/*(\w+):/g, match => match.replace(/:(?=[^:]*$)/, ''));
        return noXmlns;
    };

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
                    <Box sx={{display: 'flex', gap: 4}}>
                        <Box sx={{flex: 1, minWidth: 0, maxHeight: '80vh', overflow: 'auto'}}>
                            <Typography variant="h5">{element_id}</Typography>
                            <SyntaxHighlighter
                                language="xquery"
                                wrapLines
                                style={syntaxHighlighterTheme}
                                customStyle={{fontSize: '0.85em'}}
                                lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                                {element_xpath}
                            </SyntaxHighlighter>
                            <Divider sx={{my: 3}}/>
                            {test_data_xpaths && test_data_xpaths.map((test_data_xpath, idx) =>
                                <Box
                                    key={test_data_xpath.test_data_oid}
                                    value={test_data_xpath.test_data_id}
                                >
                                    <Box sx={{pb: 1}}>
                                        <Typography variant="h7">
                                            <b>{test_data_xpath.test_data_id}</b>
                                        </Typography>
                                        <Tooltip title='Go to file resources'>
                                            <IconButton
                                                href={paths.app.test_data_suites.resource_manager.edit.replace('[id]', test_data_xpath.test_data_suite_oid).replace('[fid]', test_data_xpath.test_data_oid)}
                                                target='_blank'
                                            >
                                                <OpenInNewIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    <Box width="100%">
                                        <i>{test_data_xpath?.xpaths?.length || 0} result(s)</i>
                                        {test_data_xpath.xpaths && test_data_xpath.xpaths.map((xpath, i) =>
                                            <>
                                                <Divider sx={{my: 1}}/>
                                                <Box
                                                    key={i}
                                                    sx={{pl: 2}}
                                                >
                                                    <Typography variant="h8"><b>{i + 1}.</b></Typography>
                                                    <Box sx={{pl: 4}}>
                                                        <Box sx={{pt: 1}}>
                                                            <Typography variant="h8">XPath:</Typography>
                                                            <SyntaxHighlighter
                                                                language="xquery"
                                                                wrapLines
                                                                style={syntaxHighlighterTheme}
                                                                customStyle={{fontSize: '0.85em'}}
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
                                                                language="xml"
                                                                wrapLines
                                                                style={syntaxHighlighterTheme}
                                                                customStyle={{fontSize: '0.85em'}}
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
                                                            <Box sx={{pt: 1, display: 'flex', alignItems: 'center', gap: 1}}>
                                                                <Typography variant="h8">Element:</Typography>
                                                                <Switch
                                                                    checked={hideNamespaces}
                                                                    onChange={e => setHideNamespaces(e.target.checked)}
                                                                    id={`hide-ns-${i}`}
                                                                    size="small"
                                                                />
                                                                <label htmlFor={`hide-ns-${i}`}>Hide namespaces</label>
                                                            </Box>
                                                            <SyntaxHighlighter
                                                                language="xml"
                                                                wrapLines
                                                                style={syntaxHighlighterTheme}
                                                                customStyle={{fontSize: '0.85em'}}
                                                                lineProps={{
                                                                    style: {
                                                                        wordBreak: 'break-all',
                                                                        whiteSpace: 'pre-wrap'
                                                                    }
                                                                }}>
                                                                {hideNamespaces ? stripNamespaces(xpath.element) : xpath.element}
                                                            </SyntaxHighlighter>
                                                        </Box>
                                                        <Divider sx={{my: 1}}/>
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                    <Divider sx={{my: 2}}/>
                                </Box>
                            )}
                        </Box>
                        {sparql_query &&
                            <Box sx={{flex: 1, minWidth: 0, maxHeight: '80vh', overflow: 'auto'}}>
                                <Typography variant="h5" sx={{mb: 2}}>SPARQL Query</Typography>
                                {sparql_query && (
                                    <>
                                        <LocalHighlighter language="sparql"
                                                          style={syntaxHighlighterTheme}
                                                          text={sparql_query}
                                                          customStyle={{fontSize: '0.85em'}}/>
                                        <Divider sx={{my: 2}}/>
                                    </>
                                )}
                                {sparql_query_results && sparql_query_results.length > 0 ? (
                                    <>
                                        <Typography variant="h6" sx={{mb: 2}}>Results</Typography>
                                        <Divider sx={{my: 2}}/>
                                        <Box component="ol" sx={{pl: 4, m: 0}}>
                                            {sparql_query_results.map((result, idx) => (
                                                <li key={idx} style={{marginBottom: 8}}>
                                                    <Box component="dl" sx={{mb: 1}}>
                                                        {Object.entries(result).map(([label, value]) => (
                                                            <Box key={label} component="div"
                                                                 sx={{display: 'flex', gap: 1, alignItems: 'left'}}>
                                                                <Typography variant="subtitle2"
                                                                            component="dt"><b>{label}:</b></Typography>
                                                                <Typography variant="body2" component="dd"
                                                                            sx={{m: 0}}>{String(value)}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </li>
                                            ))}
                                        </Box>
                                        <Divider sx={{my: 2}}/>
                                    </>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No results.</Typography>
                                )}
                            </Box>
                        }
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default XPathElements

