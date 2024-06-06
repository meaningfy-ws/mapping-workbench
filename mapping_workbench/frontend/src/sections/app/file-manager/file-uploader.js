import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/system/Box";
import LinearProgress from "@mui/material/LinearProgress";

import {FileDropzone} from 'src/components/file-dropzone';
import {sessionApi} from "../../../api/session";
import {useRouter} from "../../../hooks/use-router";


export const FileUploader = (props) => {

    const {onClose, open = false, collectionId, sectionApi, onGetItems, onlyAcceptedFormats, disableSelectFormat} = props;

    const defaultFormatValue = sectionApi.FILE_RESOURCE_DEFAULT_FORMAT;

    const [files, setFiles] = useState([]);
    const [format, setFormat] = useState(defaultFormatValue);
    const [type, setType] = useState(sectionApi.FILE_RESOURCE_DEFAULT_TYPE || "");
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false)

    const router = useRouter();

    useEffect(() => {
        setFiles([]);
    }, [open]);

    const handleUpload = async () => {
        setUploading(true)
        const incStep = 100 / files.length;
        files.forEach((file, index) => {
            const formData = new FormData();
            formData.append("title", file.name);
            formData.append("format", format);
            if (sectionApi.hasFileResourceType) {
                formData.append("type", type);
            }
            formData.append("file", file);
            formData.append("content",file.content)
            formData.append("project", sessionApi.getSessionProject());

            sectionApi.createCollectionFileResource(collectionId, formData)
                .finally(() => {
                    setProgress(e => e + incStep)
                    if (index + 1 === files.length) {
                        setProgress(0)
                        setUploading(false)
                        onGetItems ? onGetItems() : router.reload()
                        onClose()
                    }
                })
        })
    }

    const handleDrop = newFiles => {
        setFiles(prevFiles => {
            return [...prevFiles, ...newFiles];
        });
    }

    const handleRemove = file => {
        setFiles(prevFiles => prevFiles.filter((_file) => _file.path !== file.path));
    }

    const handleRemoveAll = () => setFiles([]);

     const LinearProgressWithLabel = (props) => {
       return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate"
                                {...props} />
            </Box>
                <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2"
                            color="text.secondary">{`${Math.round(
                  props.value,
                )}%`}</Typography>
            </Box>
        </Box>
       );
    }

    const acceptedFormat = onlyAcceptedFormats && sectionApi.FILE_UPLOAD_FORMATS?.[format] ? {[sectionApi.FILE_UPLOAD_FORMATS[format]]: []} : {'*/*': []}

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
                    disabled={uploading}
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
                    disabled={disableSelectFormat}
                    value={format}
                    sx={{mb: 3}}
                >
                    {Object.keys(sectionApi.FILE_RESOURCE_FORMATS).map((key) => (
                        <MenuItem key={key}
                                  value={key}>
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
                    accept={acceptedFormat}
                    caption="Max file size is 3 MB"
                    disabled={uploading}
                    files={files}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    onUpload={handleUpload}
                />

            </DialogContent>
            {uploading && <LinearProgressWithLabel value={progress}/>}
        </Dialog>
    );
};

FileUploader.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};
