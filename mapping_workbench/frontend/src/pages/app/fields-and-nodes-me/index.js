const Page = () => {
    const [files, setFiles] = useState([])
    const [xmlContent, setXmlContent] = useState()
    const [selectedFile, setSelectedFile] = useState({})
    const [xPaths, setXPaths] = useState([])

    useEffect(() => {
        schemaFiles.getItems({})
            .then(res => {
                setFiles(res)
                setXmlContent(res[1].content)
            })
            .catch(err => console.error(err))

        fieldsRegistry.getXpathsList()
            .then(res => {
                console.log(res)
                setXPaths(res)
            })
            .catch(err => console.error(err))
    }, [])



    return (
        <>
            <TextField
                fullWidth
                label="File"
                name="fileSelect"
                onChange={event => setSelectedFile(event.target.value)}
                value={files[0]}
                select
            >
                {files.map((file) => (
                    <MenuItem
                        key={file.filename}
                        value={file}
                    >
                        <Typography>
                            {file.filename}
                        </Typography>
                    </MenuItem>
                ))}
            </TextField>
            <File xmlContent={selectedFile.content} xPaths={xPaths}/>
        </>
)
}

import {useEffect, useState} from 'react';
import {Layout as AppLayout} from 'src/layouts/app';
import {schemaFileResourcesApi as schemaFiles} from 'src/api/schema-files/file-resources'

import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'
import File from 'src/sections/app/fields-and-nodes/file'
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";


import TextField from "@mui/material/TextField";

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
