import * as React from 'react';
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
import LinearProgress from '@mui/material/LinearProgress';

import {sessionApi} from "../../../api/session";
import {FileDropzone} from 'src/components/file-dropzone';
import {useRouter} from 'src/hooks/use-router';
import {Box} from "@mui/system";
import {MappingPackageFormSelect} from "../mapping-package/components/mapping-package-form-select";


export const FileUploader = (props) => {
    const router = useRouter();

    const {onClose, open = false, formik, sectionApi} = props;

    const defaultFormatValue = sectionApi.FILE_RESOURCE_DEFAULT_FORMAT;

    const [files, setFiles] = useState([]);
    const [format, setFormat] = useState(defaultFormatValue);
    const [type, setType] = useState(sectionApi.FILE_RESOURCE_DEFAULT_TYPE || "");
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false)


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
        const incStep = 100 / files.length;
        setUploading(true)
        files.forEach((file, index) => {
            getFileContent(file)
                .then(res => {
                    const request = {
                        triple_map_uri: file.name,
                        format: format,
                        triple_map_content: res,
                        project: sessionApi.getSessionProject()
                    }

                    if (sectionApi.hasMappingPackage && formik) {
                        request.mapping_package_id = formik.values.mapping_package_id;
                    }

                    sectionApi.createItem(request)
                        .finally(() => {
                            setProgress(e => e + incStep)
                            if (index + 1 === files.length) {
                                setProgress(0)
                                setUploading(false)
                                router.reload()
                            }
                        });

                })
        })
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

    const LinearProgressWithLabel = (props) => {
        return (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{width: '100%', mr: 1}}>
                    <LinearProgress variant="determinate"
                                    {...props} />
                </Box>
                <Box sx={{minWidth: 35}}>
                    <Typography variant="body2"
                                color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }

    const acceptedFormat = sectionApi.FILE_UPLOAD_FORMATS?.[format] ?? {'*/*': []}

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
                {sectionApi.hasMappingPackage && <>
                    <MappingPackageFormSelect
                        formik={formik}
                        isRequired={sectionApi.isMappingPackageRequired ?? false}
                        withDefaultPackage={true}
                    />
                    <Box sx={{mb: 3}}/>
                </>}

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
