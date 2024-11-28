import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import nProgress from 'nprogress';

import XIcon from '@untitled-ui/icons-react/build/esm/X';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import SvgIcon from '@mui/material/SvgIcon';
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from "@mui/material/FormControlLabel";

import {sessionApi} from "src/api/session";
import {FileDropzone} from 'src/components/file-dropzone';
import {DEFAULT_PACKAGE_TYPE, PACKAGE_TYPE} from "src/api/mapping-packages";
import {toastError, toastLoad, toastSuccess} from "src/components/app-toast";
import Divider from "@mui/material/Divider";



export const PackageImporter = (props) => {
    const {onClose, open = false, sectionApi} = props;

    const defaultPackageTypeValue = DEFAULT_PACKAGE_TYPE;

    const [files, setFiles] = useState([]);
    const [packageType, setPackageType] = useState(defaultPackageTypeValue);
    const [triggerPackageProcessing, setTriggerPackageProcessing] = useState(false);
    const [cleanupProject, setCleanupProject] = useState(false);

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
            formData.append("trigger_package_processing", triggerPackageProcessing);
            formData.append("cleanup_project", cleanupProject);
            formData.append("project", sessionApi.getSessionProject());
            const toastId = toastLoad(`Importing "${file.name}" ... `)
            sectionApi.importPackage(formData)
                .then(res => toastSuccess(`${res.task_name} successfully started.`, toastId))
                .catch(err => toastError(`Importing "${file.name}" failed: ${err.message}.`, toastId))

            nProgress.inc(incStep);
        }
        nProgress.done();
        onClose();
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
                    sx={{mb: 2}}
                >
                    {Object.keys(PACKAGE_TYPE).map((key) => (
                        <MenuItem key={key} value={key}>{PACKAGE_TYPE[key]}</MenuItem>
                    ))}
                </TextField>
                <FormGroup sx={{ mb: 2}}>
                    <Typography variant="h7" sx={{mb: 1}}>After Import</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={cleanupProject}
                                onChange={(e) => {
                                    setCleanupProject(e.target.checked)
                                }}
                            />
                        }
                        label="Cleanup Project Resources"
                        value="cleanup_project"
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={triggerPackageProcessing}
                            onChange={e => setTriggerPackageProcessing(e.target.checked)}
                            name="trigger_package_processing"
                        />
                        }
                        label="Process Package"
                    />
                    <Divider sx={{mt: 1}}/>
                </FormGroup>
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
    open: PropTypes.bool,
    sectionApi: PropTypes.object
};
