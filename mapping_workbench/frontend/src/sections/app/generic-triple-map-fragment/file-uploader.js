import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import {sessionApi} from "../../../api/session";
import {FileDropzone} from 'src/components/file-dropzone';
import {useRouter} from 'src/hooks/use-router';
import nProgress from 'nprogress';


export const FileUploader = (props) => {
    const router = useRouter();

    const {onClose, open = false, collectionId, sectionApi} = props;

    const defaultFormatValue = sectionApi.FILE_RESOURCE_DEFAULT_FORMAT;

    const [files, setFiles] = useState([]);
    const [format, setFormat] = useState(defaultFormatValue);
    const [type, setType] = useState(sectionApi.FILE_RESOURCE_DEFAULT_TYPE || "");

    useEffect(() => {
        setFiles([]);
    }, [open]);

    const getFileContent = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
    });

    const handleUpload = async () => {
        nProgress.start();
        const incStep = 100 / files.length;
        await files.forEach(file => {
            getFileContent(file)
                .then(res => {
                    const request = {
                        triple_map_uri: file.name,
                        format: format,
                        triple_map_content: res,
                        project: sessionApi.getSessionProject()
                    }

                    sectionApi.createItem(request);
                    nProgress.inc(incStep);
                })
        })
        nProgress.done();
        onClose();
        // router.push({
        //     pathname: paths.app[sectionApi.section].resource_manager.index,
        //     query: {id: collection_id}
        // });
        router.reload();
    }

    const handleDrop = newFiles => {
        setFiles((prevFiles) => {
            return [...prevFiles, ...newFiles];
        });
    }

    const handleRemove = file => {
        setFiles(prevFiles => prevFiles.filter((_file) => _file.path !== file.path));
    }

    const handleRemoveAll = () => setFiles([]);

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={3}
                sx={{
                    px: 3,
                    py: 2
                }}
            >
                <Typography variant="h6">
                    Upload Files
                </Typography>
                <IconButton
                    color="inherit"
                    onClick={onClose}
                >
                    <SvgIcon>
                        <XIcon/>
                    </SvgIcon>
                </IconButton>
            </Stack>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Format"
                    onChange={e => setFormat(e.target.value)}
                    select
                    required
                    value={format}
                    sx={{mb: 3}}
                >
                    {Object.keys(sectionApi.FILE_RESOURCE_FORMATS).map((key) => (
                        <MenuItem key={key} value={key}>
                            {sectionApi.FILE_RESOURCE_FORMATS[key]}
                        </MenuItem>
                    ))}
                </TextField>
                {sectionApi.hasFileResourceType && (
                    <TextField
                        fullWidth
                        label="Type"
                        onChange={e => setType(e.target.value)}
                        select
                        value={type}
                        sx={{mb: 3}}
                    >
                        {Object.keys(sectionApi.FILE_RESOURCE_TYPES)?.map((key) => (
                            <MenuItem key={key}
                                      value={key}>
                                {sectionApi.FILE_RESOURCE_TYPES[key]}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                <FileDropzone
                    accept={{'*/*': []}}
                    caption="Max file size is 3 MB"
                    files={files}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    onUpload={handleUpload}
                />

            </DialogContent>
        </Dialog>
    );
};

FileUploader.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};
