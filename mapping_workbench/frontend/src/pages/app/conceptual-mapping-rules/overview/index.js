import {useState} from 'react';
import {useFormik} from 'formik';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';

import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import SvgIcon from '@mui/material/SvgIcon';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {sessionApi} from 'src/api/session';
import {tokens} from "/src/locales/tokens";
import {useDialog} from 'src/hooks/use-dialog';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {Filter} from 'src/sections/components/filter';
import useItemsSearch from 'src/hooks/use-items-search';
import {useItemsStore} from 'src/hooks/use-items-store';
import {TableSearchBar} from 'src/sections/components/table-search-bar';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {toastError, toastLoad, toastSuccess} from 'src/components/app-toast';
import {ListTable} from "src/sections/app/conceptual-mapping-rule/list-table";
import {conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import {MappingPackageFormSelect} from 'src/sections/app/mapping-package/components/mapping-package-form-select';

const filterValues = [{label: 'All', value: ''},
    {label: 'Valid', value: 'valid'},
    {label: 'Invalid', value: 'invalid'}]

const Page = () => {
    const [detailedView, setDetailedView] = useState(true)
    const {t} = useTranslation();

    const itemsStore = useItemsStore(sectionApi);
    const itemsSearch = useItemsSearch(itemsStore.items, sectionApi,
        ['source_structural_element_sdk_element_id', 'target_class_path', 'target_property_path'],
        {terms: ''});

    const generateSHACLDialog = useDialog();

    const initialValues = {
        shacl_checked: true,
        mapping_package_id: '',
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            mapping_package_id:
                Yup
                    .string()
                    .required('Mapping Package is required'),
        }),
        onSubmit: (values, helpers) => {
            const toastId = toastLoad("Generating SHACL...")
            helpers.setSubmitting(true)

            sectionApi.generateSHACL()
                .then(res => {
                    if (!values['mapping_package_id']) values['mapping_package_id'] = null;
                    values['project'] = sessionApi.getSessionProject();
                    helpers.setStatus({success: true});
                    toastSuccess('SHACL Generated', toastId);
                })
                .catch(err => {
                    console.error(err);
                    toastError(err, toastId);
                    helpers.setStatus({success: false});
                    helpers.setErrors({submit: err.message});
                })
                .finally(res => {
                    helpers.setSubmitting(false)
                })
        }
    });

    usePageView();

    return (
        <>
            <Seo title={`App: ${sectionApi.SECTION_TITLE} List`}/>
            <Stack spacing={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                >
                    <Stack spacing={1}>
                        <Typography variant="h4">
                            Overview {sectionApi.SECTION_TITLE}
                        </Typography>
                        <Breadcrumbs separator={<BreadcrumbsSeparator/>}>
                            <Link
                                color="text.primary"
                                component={RouterLink}
                                href={paths.index}
                                variant="subtitle2"
                            >
                                App
                            </Link>
                            <Typography
                                color="text.secondary"
                                variant="subtitle2"
                            >
                                Overview {sectionApi.SECTION_TITLE}
                            </Typography>
                        </Breadcrumbs>
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
                            startIcon={(
                                <SvgIcon>
                                    <AddIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Add
                        </Button>
                        <Button
                            id="generate_button"
                            component={RouterLink}
                            href={paths.app[sectionApi.section].tasks.generate_cm_assertions_queries}
                            startIcon={(
                                <SvgIcon>
                                    <CachedIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            {t(tokens.nav.generate_cm_assertions_queries)}
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <TableSearchBar onChange={e => itemsSearch.handleSearchItems([e])}
                                    value={itemsSearch.state.search[0]}/>
                    <Divider/>
                    <Stack direction='row'
                           padding={3}>
                        <FormControlLabel control={<Switch checked={detailedView}
                                                           onChange={e => setDetailedView(e.target.checked)}/>}
                                          label='Detailed View'/>
                        <Paper variant='outlined'>
                            <Filter title={'Terms:'}
                                    values={filterValues}
                                    value={itemsSearch.state.filters.terms}
                                    onValueChange={e => itemsSearch.handleFiltersChange({terms: e})}/>
                        </Paper>
                    </Stack>
                    <Divider/>
                    <ListTable
                        sectionApi={sectionApi}
                        items={itemsSearch.pagedItems}
                        count={itemsStore.itemsCount}
                        detailedView={detailedView}
                        page={itemsSearch.state.page}
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        onSort={itemsSearch.handleSort}
                        sort={{direction: itemsSearch.state.sortDirection, column: itemsSearch.state.sortField}}
                    />
                </Card>
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
                                Mapping Rule Triple Map Fragment
                            </Typography>
                            <MappingPackageFormSelect
                                formik={formik}
                                disabled={formik.isSubmitting}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formik.values.shacl_checked}
                                        onChange={(e) => {
                                            formik.setFieldValue('shacl_checked', e.target.checked)
                                        }}
                                    />
                                }
                                disabled={formik.isSubmitting}
                                label="Close SHACL"
                                value="cleanup_project"
                            />
                            <LoadingButton type='submit'
                                           variant="contained"
                                           fullWidth
                                           size="small"
                                           color="success"
                                           loading={formik.isSubmitting}
                                           loadingPosition="start"
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
