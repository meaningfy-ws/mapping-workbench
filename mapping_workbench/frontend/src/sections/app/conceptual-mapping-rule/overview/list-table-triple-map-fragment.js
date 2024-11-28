import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import EditIcon from '@untitled-ui/icons-react/build/esm/Edit05';
import {useFormik} from 'formik';
import {useEffect, useState} from 'react';
import * as Yup from 'yup';
import {conceptualMappingRulesApi} from '../../../../api/conceptual-mapping-rules';
import {sessionApi} from '../../../../api/session';
import {genericTripleMapFragmentsApi} from '../../../../api/triple-map-fragments/generic';
import {toastSuccess} from '../../../../components/app-toast';
import {FormCodeTextArea} from '../../../../components/app/form/code-text-area';
import {useDialog} from '../../../../hooks/use-dialog';

export const ListTableTripleMapFragment = (props) => {
    const {
        item, initProjectTripleMapFragments = null,
        isCurrent,
        isHovered
    } = props;

    const [tripleMapFragment, setTripleMapFragment] = useState({});
    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState(initProjectTripleMapFragments || []);
    const triple_map_fragment_id = item.triple_map_fragment?.id;

    useEffect(() => {
        if (initProjectTripleMapFragments === null) {
            genericTripleMapFragmentsApi.getValuesForSelector()
                .then(res => setProjectTripleMapFragments(res))
                .catch(err => console.error(err))
        }
        if (triple_map_fragment_id) {
            setTripleMapFragment(projectTripleMapFragments.find(x => x._id === triple_map_fragment_id));
        }
    }, [])

    const [ruleTripleMapFragment, setRuleTripleMapFragment] = useState(triple_map_fragment_id);

    const initialValues = {
        triple_map_uri: (tripleMapFragment && tripleMapFragment.triple_map_uri) ?? '',
        triple_map_content: (tripleMapFragment && tripleMapFragment.triple_map_content) ?? '',
        format: (tripleMapFragment && tripleMapFragment.format) ?? genericTripleMapFragmentsApi.FILE_RESOURCE_DEFAULT_FORMAT ?? '',
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            triple_map_uri: Yup
                .string()
                .max(255)
                .required('URI is required'),
            triple_map_content: Yup.string().max(2048),
            format: Yup
                .string()
                .max(255)
                .required('Format is required')
        }),
        onSubmit: async (values, helpers) => {
        }
    });

    const tripleMapFragmentDialog = useDialog();

    const tripleMapFragmentDetailsDialog = useDialog()

    const [updateContent, setUpdateContent] = useState(false);

    const handleTripleMapFragmentDetailsDialogOpen = () => {
        tripleMapFragmentDetailsDialog.handleOpen();
    }

    const handleTripleMapFragmentDialogOpen = async () => {
        setUpdateContent(false);
        const tripleMapFragmentData = ruleTripleMapFragment ?
            await genericTripleMapFragmentsApi.getItem(ruleTripleMapFragment) : null;
        setTripleMapFragment(tripleMapFragmentData ?? {});
        tripleMapFragmentDialog.handleOpen();
    }

    const handleTripleMapFragmentDialogClose = () => {
        tripleMapFragmentDialog.handleClose();
        setUpdateContent(false);
        setTripleMapFragment({});
    }

    const handleTripleMapFragmentUpdate = async () => {
        const values = {}
        const tripleMapFragmentId = tripleMapFragment?._id ?? null;
        values['id'] = item._id;
        values['project'] = sessionApi.getSessionProject();
        values['triple_map_fragment'] = tripleMapFragmentId;
        await conceptualMappingRulesApi.updateItem(values);
        setRuleTripleMapFragment(tripleMapFragmentId);
        toastSuccess(conceptualMappingRulesApi.SECTION_ITEM_TITLE + ' updated');

        if (updateContent) {
            const contentValues = {
                id: tripleMapFragment._id,
                format: formik.values.format,
                triple_map_content: formik.values.triple_map_content
            }
            await genericTripleMapFragmentsApi.updateItem(contentValues);
            toastSuccess(genericTripleMapFragmentsApi.SECTION_ITEM_TITLE + ' updated');
        }
        handleTripleMapFragmentDialogClose();
    }

    const handleTripleMapFragmentSelect = (e) => {
        setUpdateContent(false);
        e.target.value && genericTripleMapFragmentsApi.getItem(e.target.value)
            .then(res => setTripleMapFragment(res))
            .catch(err => console.error(err))
    }

    const ruleTripleMapFragments = projectTripleMapFragments.filter(x => ruleTripleMapFragment === x.id);

    const RuleTripleMapFragments = () => <Box sx={{mb: 1}}>
        {ruleTripleMapFragments.map(x => (
            <ListItem sx={{whiteSpace: "w"}}
                      key={"triple_map_fragment_" + x.id}>{x.uri}</ListItem>
        ))}
    </Box>

    const isRuleTripleMapFragments = !!ruleTripleMapFragments.length

    return (<Box sx={{position: 'relative'}}>
        <Box>
            {isRuleTripleMapFragments ? <CheckIcon color="success"/> : <CloseIcon color="error"/>}
        </Box>
        {isHovered && <Box sx={{position: "absolute", left: "50%", top: "50%",}}>
            <Tooltip enterDelay={300}
                     title={isRuleTripleMapFragments && <RuleTripleMapFragments/>}>
                <Stack display="flex"
                       direction="column"
                       gap={1}
                       sx={{
                           marginTop: isRuleTripleMapFragments ? "-50%" : "-31%",
                           transform: "translate(-50%)"
                       }}
                >
                    {isRuleTripleMapFragments && <Button
                        aria-describedby={"triple_map_fragment_dialog_" + item._id}
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={handleTripleMapFragmentDetailsDialogOpen}
                        component={Link}
                    >
                        <SvgIcon fontSize="small">
                            <InfoIcon/>
                        </SvgIcon>
                    </Button>}
                    <Button
                        aria-describedby={"triple_map_fragment_dialog_" + item._id}
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={handleTripleMapFragmentDialogOpen}
                        component={Link}
                    >
                        <SvgIcon fontSize="small">
                            <EditIcon/>
                        </SvgIcon>
                    </Button>
                </Stack>
            </Tooltip>
        </Box>}
        <Dialog
            id={"triple_map_fragment_dialog_" + item._id}
            onClose={handleTripleMapFragmentDialogClose}
            open={tripleMapFragmentDialog.open}
            fullWidth
            maxWidth="sm"
        >
            <Stack
                spacing={3}
                sx={{
                    px: 3, py: 2
                }}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Typography variant="h6">
                        Mapping Rule Triple Map Fragment
                    </Typography>
                    <Box
                        spacing={3}>
                        <FormControl sx={{my: 2, width: '100%'}}>
                            <TextField
                                fullWidth
                                label={genericTripleMapFragmentsApi.SECTION_ITEM_TITLE}
                                onChange={handleTripleMapFragmentSelect}
                                select
                                value={tripleMapFragment?._id ?? ""}
                            >
                                <MenuItem value={null}>&nbsp;</MenuItem>
                                {projectTripleMapFragments.map(({id, uri}) => (
                                    <MenuItem key={id}
                                              value={id}>{uri}</MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Box>
                    {tripleMapFragment?._id && (
                        <>
                            <Box>
                                <Grid xs={12}
                                      md={12}
                                      pb={2}
                                      item>
                                    <FormControlLabel
                                        sx={{
                                            width: '100%'
                                        }}
                                        control={
                                            <Switch
                                                checked={updateContent}
                                                onChange={e =>
                                                    setUpdateContent(e.target.checked)}
                                            />
                                        }
                                        label="Update content"
                                        value="updateContent"
                                    />
                                </Grid>
                            </Box>
                            {updateContent &&
                                <Box>
                                    <Grid container>
                                        <Grid xs={12}
                                              md={12}>
                                            <FormControl fullWidth>
                                                <FormLabel
                                                    sx={{
                                                        color: 'text.primary',
                                                        mb: 1
                                                    }}
                                                >
                                                    Format
                                                </FormLabel>
                                                <Select
                                                    variant='standard'
                                                    name="format"
                                                    error={!!(formik.touched.format && formik.errors.format)}
                                                    fullWidth
                                                    helperText={formik.touched.format && formik.errors.format}
                                                    value={formik.values.format}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                >
                                                    {Object.keys(genericTripleMapFragmentsApi.FILE_RESOURCE_FORMATS).map((key) => {
                                                        return (
                                                            <MenuItem value={key}
                                                                      key={key}>
                                                                {genericTripleMapFragmentsApi.FILE_RESOURCE_FORMATS[key]}
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid xs={12}
                                              md={12}
                                              py={2}>
                                            <FormCodeTextArea
                                                formik={formik}
                                                name="triple_map_content"
                                                label="Content"
                                                grammar={genericTripleMapFragmentsApi.FILE_RESOURCE_CODE[formik.values.format]['grammar']}
                                                language={genericTripleMapFragmentsApi.FILE_RESOURCE_CODE[formik.values.format]['language']}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            }
                        </>
                    )}
                    <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        color="success"
                        disabled={formik.isSubmitting}
                        onClick={handleTripleMapFragmentUpdate}
                    >
                        Update
                    </Button>
                </form>
            </Stack>
        </Dialog>
        <Dialog
            id={"triple_map_fragment_details_dialog_" + item._id}
            onClose={tripleMapFragmentDetailsDialog.handleClose}
            open={tripleMapFragmentDetailsDialog.open}
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
                    Mapping Rule Triple Map Fragment Details
                </Typography>
                <Divider/>
                <RuleTripleMapFragments/>
            </Stack>
        </Dialog>
    </Box>)
}