import {useEffect, useState} from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import {parseString, Builder} from "xml2js";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import {Layout as AppLayout} from 'src/layouts/app';
import {schemaFileResourcesApi as schemaFiles} from 'src/api/schema-files/file-resources'
import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'
import CircularProgress from "@mui/material/CircularProgress";
import {AlertTitle, Alert} from "@mui/material";

// import File from '/home/user/work/mnfy/mapping-workbench/mapping_workbench/frontend/src/sections/app/fileds-and-nodes/file.js

import File from 'src/sections/app/fields-and-nodes/file'


const Page = () => {
    const [files, setFiles] = useState([])
    const [xmlContent, setXmlContent] = useState()

    useEffect(() => {
        schemaFiles.getItems({})
            .then(res => {
                setFiles(res)
                setXmlContent(res[1].content)
            })
            .catch(err => console.error(err))

        // fieldsRegistry.getXpathsList()
        //     .then(res => {
        //         console.log(res)
        //         setXPaths(res)
        //     })
        //     .catch(err => console.error(err))
    }, [])



    return (
        <File xmlContent={xmlContent}/>
    )
}

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
