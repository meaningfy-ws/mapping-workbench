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
import TextField from "@mui/material/TextField";
import * as React from "react";
import toast from "react-hot-toast";


export const PackageImporter = (props) => {
    const router = useRouter();

    const {onClose, open = false, sectionApi} = props;

    const [files, setFiles] = useState([]);
    useEffect(() => {
        setFiles([]);
    }, [open]);

    const handleUpload = useCallback(() => {
        nProgress.start();
        let incStep = 100 / files.length;
        let formData;
        for (let file of files) {
            formData = new FormData();
            formData.append("file", file);
            formData.append("project", sessionApi.getSessionProject());
            toast.promise(sectionApi.importPackage(formData), {
                loading: `Importing "${file.name}" ... `,
                success: (mappingPackage) => `"${mappingPackage.title}" successfully imported.`,
                error: (err) => `Importing "${file.name}" failed: ${err.message}.`
            }).then(r => {})
            nProgress.inc(incStep);
        }
        nProgress.done();
        onClose();
        // router.push({
        //     pathname: paths.app[sectionApi.section].index
        // });
        //router.reload();
    }, [files])

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
                    Import Packages
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
            <DialogContent id="drop-zone">
                <FileDropzone
                    accept={{'*/*': []}}
                    caption="Required name: {PACKAGE_NAME}.zip"
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

PackageImporter.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};
