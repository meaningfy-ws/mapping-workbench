import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {sparqlTestFileResourcesApi} from "../../../api/sparql-test-suites/file-resources";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Dialog from "@mui/material/Dialog";
import {useDialog} from "../../../hooks/use-dialog";


const CMQuery = (props) => {
    const {cm_query_id, ...other} = props;
    const queryDialog = useDialog()
    const [query, setQuery] = useState(null)

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
            <Button variant="text" type='link' onClick={openQueryDialog} title={query?.title}>Query</Button>
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
                        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}>
                        {queryDialog.data?.content}
                    </SyntaxHighlighter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CMQuery