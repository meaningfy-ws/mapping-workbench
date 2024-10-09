import {useEffect, useState} from "react";
import {Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import {useDialog} from "src/hooks/use-dialog";
import {useHighlighterTheme} from "src/hooks/use-highlighter-theme";
import {sparqlTestFileResourcesApi} from "src/api/sparql-test-suites/file-resources";


const CMQuery = (props) => {
    const {cm_query_id, ...other} = props;
    const queryDialog = useDialog()
    const [query, setQuery] = useState(null)
    const syntaxHighlighterTheme = useHighlighterTheme()

    useEffect(() => {
        sparqlTestFileResourcesApi.getFileResource(cm_query_id).then(res => {
            setQuery(res)
        })
    }, []);

    const openQueryDialog = () => {
        queryDialog.handleOpen({
            title: query?.title,
            content: query?.content
        })
    }

    return (
        <>
            <Button variant="text"
                    type='link'
                    onClick={openQueryDialog}
                    title={query?.title}>
                Query
            </Button>
            <Dialog
                open={queryDialog.open}
                onClose={queryDialog.handleClose}
                fullWidth
                maxWidth='xl'
            >
                <DialogTitle>
                    {queryDialog.data?.title}
                </DialogTitle>
                <DialogContent>
                    <SyntaxHighlighter
                        language="sparql"
                        wrapLines
                        style={syntaxHighlighterTheme}
                        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                        {queryDialog.data?.content}
                    </SyntaxHighlighter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CMQuery