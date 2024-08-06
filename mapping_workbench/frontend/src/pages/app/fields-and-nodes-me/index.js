import {useEffect, useState} from 'react';

import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import {Layout as AppLayout} from 'src/layouts/app';
import File from 'src/sections/app/fields-and-nodes/file'
import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'
import {schemaFileResourcesApi as schemaFiles} from 'src/api/schema-files/file-resources'

const Page = () => {
    const [files, setFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState({})
    const [xPaths, setXPaths] = useState([])

    useEffect(() => {
        schemaFiles.getItems({})
            .then(res => {
                setFiles(res)
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
            <File xmlContent={selectedFile.content}
                  xPaths={xPaths}/>
        </>
)
}



Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
