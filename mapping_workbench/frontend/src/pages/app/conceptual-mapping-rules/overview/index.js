import {useState} from 'react';
import {useFormik} from 'formik';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';

import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import FormControlLabel from '@mui/material/FormControlLabel';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {tokens} from "/src/locales/tokens";
import {useDialog} from 'src/hooks/use-dialog';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {Filter} from 'src/sections/components/filter';
import useItemsSearch from 'src/hooks/use-items-search';
import {useItemsStore} from 'src/hooks/use-items-store';
import {TableSearchBar} from 'src/sections/components/table-search-bar';
import {TableLoadWrapper} from 'src/sections/components/table-load-wrapper';
import {NavigationTabsWrapper} from 'src/components/navigation-tabs-wrapper';
import {toastError, toastLoad, toastSuccess} from 'src/components/app-toast';
import {ListTable} from "src/sections/app/conceptual-mapping-rule/list-table";
import {conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import {ConceptualMappingTabs} from 'src/sections/app/conceptual-mapping-rule/conceptual-mapping-tabs';
import {MappingPackageFormSelect} from 'src/sections/app/mapping-package/components/mapping-package-form-select';

const FILTER_VALUES = [{label: 'All', value: ''},
    {label: 'Valid', value: 'valid'},
    {label: 'Invalid', value: 'invalid'}]

const Page = () => {
    const {t} = useTranslation();

    const [filterPopover, setFilterPopover] = useState(null)
    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi,
        ['source_structural_element_sdk_element_id', 'target_class_path', 'target_property_path'],
        {terms: ''});

    const generateSHACLDialog = useDialog();

    const initialValues = {
        close_shacl: true,
        mapping_package_id: '',
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({}),
        onSubmit: (values, helpers) => {
            const toastId = toastLoad("Generating SHACL Shapes...")
            helpers.setSubmitting(true)
            values.mapping_package_id = values.mapping_package_id ? values.mapping_package_id : null;
            sectionApi.generateSHACL(values)
                .then((res) => {
                    helpers.setStatus({success: true});
                    toastSuccess(`${res.task_name} successfully started.`, toastId)
                })
                .catch(err => {
                    console.log(err)
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                    toastError(`SHACL Shapes Generator failed: ${err.message}.`, toastId);
                })
                .finally(res => {
                    helpers.setSubmitting(false);
                    generateSHACLDialog.handleClose();
                });
        }
    });

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <NavigationTabsWrapper>
                <ConceptualMappingTabs/>
            </NavigationTabsWrapper>
            <Stack spacing={4}
                   mt={5}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack direction='row'
                           spacing={3}>
                        <Paper>
                            <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                            value={itemsSearch.state.search[0]}/>
                        </Paper>
                        <Paper>
                            <Button variant='text'
                                    color={itemsSearch.state.filters.terms ? 'primary' : 'inherit'}
                                    onClick={e => setFilterPopover(e.currentTarget)}
                                    startIcon={<FilterListIcon/>}>
                                Filter
                            </Button>
                            <Popover
                                id={'filter-popover'}
                                open={!!filterPopover}
                                anchorEl={filterPopover}
                                onClose={() => setFilterPopover(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Filter title='Terms:'
                                        values={FILTER_VALUES}
                                        value={itemsSearch.state.filters.terms}
                                        onValueChange={e => itemsSearch.handleFiltersChange({terms: e})}/>
                            </Popover>
                        </Paper>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={3}
                    >
                        <Button id="generate_shacl_button"
                                onClick={generateSHACLDialog.handleOpen}>
                            Generate SHACL
                        </Button>
                        <Button
                            component={RouterLink}
                            href={paths.app[sectionApi.section].overview.create}
                            id="add-mapping-rules-button"
                            startIcon={<AddIcon/>}
                            variant="contained"
                        >
                            Add
                        </Button>
                        <Button
                            id="generate_button"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].tasks.generate_cm_assertions_queries}
                            startIcon={<CachedIcon/>}
                            variant="contained"
                        >
                            {t(tokens.nav.generate_cm_assertions_queries)}
                        </Button>
                    </Stack>
                </Stack>

                <TableLoadWrapper data={itemsStore.items}
                                  dataState={itemsStore}>
                    <ListTable
                        sectionApi={sectionApi}
                        items={itemsSearch.pagedItems}
                        count={itemsSearch.count}
                        page={itemsSearch.state.page}
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        onSort={itemsSearch.handleSort}
                        sort={itemsSearch.state.sort}
                    />
                </TableLoadWrapper>
                <Dialog id='shacl_generate_dialog'
                        open={generateSHACLDialog.open}
                        onClose={generateSHACLDialog.handleClose}
                        fullWidth
                        maxWidth="sm">
                    <form onSubmit={formik.handleSubmit}>
                        <Stack
                            spacing={3}
                            sx={{px: 3, py: 2}}>
                            <Typography variant="h6">
                                SHACL Shapes Generator
                            </Typography>
                            <Alert severity="info">
                                Select the Mapping Package to use needed resources from or leave empty to use all
                                Project's resources
                            </Alert>
                            <MappingPackageFormSelect
                                formik={formik}
                                disabled={formik.isSubmitting}
                                isRequired={false}
                            />
                            <Divider/>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formik.values.close_shacl}
                                        onChange={(e) => {
                                            formik.setFieldValue('close_shacl', e.target.checked)
                                        }}
                                    />
                                }
                                disabled={formik.isSubmitting}
                                label="Close SHACL Shapes"
                                value="close_shacl"
                            />
                            <LoadingButton type='submit'
                                           variant="contained"
                                           fullWidth
                                           size="small"
                                           color="success"
                                           loading={formik.isSubmitting}
                            >
                                Generate
                            </LoadingButton>
                        </Stack>
                    </form>
                </Dialog>
            </Stack>
        </>
    );
};

Page.getLayout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
);

export default Page;
