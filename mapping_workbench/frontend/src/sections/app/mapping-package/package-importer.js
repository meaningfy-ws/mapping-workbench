import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import nProgress from 'nprogress';

import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';

import Typography from '@mui/material/Typography';
import {FileDropzone} from 'src/components/file-dropzone';
import {useRouter} from 'src/hooks/use-router';
import {sessionApi} from "../../../api/session";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {PACKAGE_TYPE} from "../../../api/mapping-packages";


export const PackageImporter = (props) => {
    const router = useRouter();

    const {onClose, open = false, sectionApi} = props;

    const defaultPackageTypeValue = PACKAGE_TYPE.EFORMS;

    const [files, setFiles] = useState([]);
    const [packageType, setPackageType] = useState(defaultPackageTypeValue);

    console.log("K :: ", packageType);
    useEffect(() => {
        setFiles([]);
    }, [open]);

    const handleUpload = useCallback(() => {
        nProgress.start();
        const incStep = 100 / files.length;
        let formData;
        for (let file of files) {
            formData = new FormData();
            formData.append("file", file);
            formData.append("package_type", packageType);
            formData.append("project", sessionApi.getSessionProject());
            const toastId = toastLoad(`Importing "${file.name}" ... `)
            sectionApi.importPackage(formData)
                .then(res => toastSuccess(`${res.task_name} successfully started.`, toastId))
                .catch(err => toastError(`Importing "${file.name}" failed: ${err.message}.`, toastId))

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
                <TextField
                    fullWidth
                    label="Type"
                    onChange={e => setPackageType(e.target.value)}
                    select
                    required
                    value={packageType}
                    sx={{mb: 3}}
                >
                    {Object.keys(PACKAGE_TYPE).map((key) => (
                        <MenuItem key={key} value={PACKAGE_TYPE[key]}>{PACKAGE_TYPE[key]}</MenuItem>
                    ))}
                </TextField>
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
