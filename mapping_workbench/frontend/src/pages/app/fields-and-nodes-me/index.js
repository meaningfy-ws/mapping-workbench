import {useEffect, useState} from 'react';

import {Layout as AppLayout} from 'src/layouts/app';
import {schemaFileResourcesApi as schemaFiles} from 'src/api/schema-files/file-resources'
import {fieldsRegistryApi as fieldsRegistry} from 'src/api/fields-registry'

import File from 'src/sections/app/fields-and-nodes/file'


const Page = () => {
    const [files, setFiles] = useState([])
    const [xmlContent, setXmlContent] = useState()
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
        <File xmlContent={xmlContent}/>
    )
}

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
