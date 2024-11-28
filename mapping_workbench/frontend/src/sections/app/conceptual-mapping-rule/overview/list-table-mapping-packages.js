import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import EditIcon from '@untitled-ui/icons-react/build/esm/Edit05';
import {useEffect, useState} from 'react';
import {conceptualMappingRulesApi} from '../../../../api/conceptual-mapping-rules';
import {mappingPackagesApi} from '../../../../api/mapping-packages';
import {sessionApi} from '../../../../api/session';
import {toastSuccess} from '../../../../components/app-toast';
import {useDialog} from '../../../../hooks/use-dialog';
import {MappingPackageCheckboxList} from '../../mapping-package/components/mapping-package-real-checkbox-list';

export const ListTableMappingPackages = (props) => {
    const {
        item,
        initProjectMappingPackages = null,
        onPackagesUpdate = () => { },
        isHovered
    } = props;

    const ruleFilteredMappingPackages = item.refers_to_mapping_package_ids ?? [];
    const [mappingPackages, setMappingPackages] = useState(ruleFilteredMappingPackages);
    const [projectMappingPackages, setProjectMappingPackages] = useState(initProjectMappingPackages ?? []);
    const [tempMappingPackages, setTempMappingPackages] =
        useState(ruleFilteredMappingPackages);

    useEffect(() => {
        if (initProjectMappingPackages === null) {
            mappingPackagesApi.getProjectPackages()
                .then(res => setProjectMappingPackages(res))
                .catch(err => console.error(err))
        }
    }, [])

    const mappingPackagesDialog = useDialog();

    const handleMappingPackagesUpdate = async () => {
        const values = {}
        values['id'] = item._id;
        values['project'] = sessionApi.getSessionProject();
        values['refers_to_mapping_package_ids'] = tempMappingPackages;
        await conceptualMappingRulesApi.updateItem(values);
        setMappingPackages(tempMappingPackages);
        item.refers_to_mapping_package_ids = tempMappingPackages;
        toastSuccess(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');
        mappingPackagesDialog.handleClose();
        onPackagesUpdate()
    };

    const ruleMappingPackages = projectMappingPackages.filter(x => mappingPackages.includes(x.id))

    const mappingPackagesDialogHandleClose = () => {
        mappingPackagesDialog.handleClose();
        setTempMappingPackages(ruleFilteredMappingPackages);
    }

    return (<Box sx={{position: 'relative'}} >
        {ruleMappingPackages.length > 0 && <Box >
            {ruleMappingPackages.map(x => (
                <Chip key={"mapping_package_" + x.id}
                      sx={{mb: 1}}
                      label={x.title}/>))}
        </Box>}
        {isHovered &&
            <Box sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
            }}>
                <Button
                    aria-describedby={"mapping_packages_dialog_" + item._id}
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={mappingPackagesDialog.handleOpen}
                    component={Link}
                    sx={{
                        marginLeft: "-50%",
                        marginTop: "-50%"
                    }}
                >
                    <SvgIcon fontSize="small">
                        <EditIcon/>
                    </SvgIcon>
                </Button>
            </Box>}
        <Dialog
            id={"mapping_packages_dialog_" + item._id}
            onClose={mappingPackagesDialogHandleClose}
            open={mappingPackagesDialog.open}
            fullWidth
            maxWidth="sm"
        >
            <Stack
                spacing={3}
                sx={{
                    px: 3, py: 2
                }}
            >
                <Typography variant="h6">
                    Mapping Rule Packages
                </Typography>
                <Box
                    spacing={3}>
                    <MappingPackageCheckboxList
                        handleUpdate={setTempMappingPackages}
                        mappingPackages={tempMappingPackages}
                        initProjectMappingPackages={projectMappingPackages}/>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={handleMappingPackagesUpdate}
                >
                    Update
                </Button>
            </Stack>
        </Dialog>
    </Box>)
}
