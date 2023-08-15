import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import {FileDropzone} from 'src/components/file-dropzone';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {useRouter} from 'src/hooks/use-router';
import nProgress from 'nprogress';
import {sessionApi} from "../../../api/session";


export const FileUploader = (props) => {
    const router = useRouter();

    const {onClose, open = false, collectionId, sectionApi} = props;

    const defaultFormatValue = sectionApi.FILE_RESOURCE_DEFAULT_FORMAT;

    const [files, setFiles] = useState([]);
    const [format, setFormat] = useState(defaultFormatValue);
    useEffect(() => {
        setFiles([]);
    }, [open]);

    const handleUpload = useCallback(async() => {
        nProgress.start();
        let incStep = 100 / files.length;
        for (let file of files) {
            let formData = new FormData();

            formData.append("title", file.name);
            formData.append("format", format);
            formData.append("file", file);
            formData.append("project", sessionApi.getSessionProject());
            await sectionApi.createCollectionFileResource(collectionId, formData);
            nProgress.inc(incStep);
        }
        nProgress.done();
        onClose();
        // router.push({
        //     pathname: paths.app[sectionApi.section].file_manager.index,
        //     query: {id: collection_id}
        // });
        router.reload();
    }, [files, format]);

    const handleDrop = useCallback((newFiles) => {
        setFiles((prevFiles) => {
            return [...prevFiles, ...newFiles];
        });
    }, []);

    const handleRemove = useCallback((file) => {
        setFiles((prevFiles) => {
            return prevFiles.filter((_file) => _file.path !== file.path);
        });
    }, []);

    const handleRemoveAll = useCallback(() => {
        setFiles([]);
    }, []);

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
                <Select
                    name="format"
                    fullWidth
                    onChange={e => setFormat(e.target.value)}
                    value={format}
                >
                    {Object.keys(sectionApi.FILE_RESOURCE_FORMATS).map((key) => {
                        return (
                            <MenuItem value={key} key={key}>
                                {sectionApi.FILE_RESOURCE_FORMATS[key]}
                            </MenuItem>
                        )
                    })}
                </Select>
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
