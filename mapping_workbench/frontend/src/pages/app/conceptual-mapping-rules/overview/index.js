import {useFormik} from 'formik';
import {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";

import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import RefreshIcon from '@untitled-ui/icons-react/build/esm/Repeat02';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';

import {paths} from 'src/paths';
import {Seo} from 'src/components/seo';
import {tokens} from "/src/locales/tokens";
import {useDialog} from 'src/hooks/use-dialog';
import {usePageView} from 'src/hooks/use-page-view';
import {Layout as AppLayout} from 'src/layouts/app';
import {RouterLink} from 'src/components/router-link';
import {BreadcrumbsSeparator} from 'src/components/breadcrumbs-separator';
import {ListSearch} from "src/sections/app/conceptual-mapping-rule/list-search";
import {ListTable} from "src/sections/app/conceptual-mapping-rule/list-table";
import {conceptualMappingRulesApi as sectionApi} from 'src/api/conceptual-mapping-rules';
import * as Yup from 'yup';
import {sessionApi} from '../../../../api/session';
import {toastError, toastLoad, toastSuccess} from '../../../../components/app-toast';
import {
    MappingPackageFormSelect
} from '../../../../sections/app/mapping-package/components/mapping-package-form-select';

const useItemsSearch = () => {
    const [state, setState] = useState({
        filters: {
            q: undefined,
            terms_validity: undefined
        },
        sortField: '',
        sortDirection: undefined,
        page: sectionApi.DEFAULT_PAGE,
        rowsPerPage: sectionApi.DEFAULT_ROWS_PER_PAGE,
        detailedView: true
    });

    const handleFiltersChange = filters => {
        setState(prevState => ({
            ...prevState,
            filters,
            page: 0
        }));
    }

    const handlePageChange = (event, page) => {
        setState(prevState => ({
            ...prevState,
            page
        }));
    }

    const handleRowsPerPageChange = event => {
        setState(prevState => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }

    const handleDetailedViewChange = (event, detailedView) => {
        setState(prevState => ({
            ...prevState,
            detailedView
        }));
    }

    const handleSorterChange = sortField => {
        setState(prevState => ({
            ...prevState,
            sortField,
            sortDirection: state.sortField === sortField && prevState.sortDirection === -1 ? 1 : -1
        }))
    }

    return {
        handleSorterChange,
        handleFiltersChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleDetailedViewChange,
        state
    };
};


const useItemsStore = (searchState) => {
    const [state, setState] = useState({
        items: [],
        itemsCount: 0
    });

    const handleItemsGet = () => {
        sectionApi.getItems(searchState)
            .then(res => setState({items: res.items, itemsCount: res.count}))
            .catch(err => console.warn(err))
    }

    useEffect(() => {
            handleItemsGet();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};


const Page = () => {
    const {t} = useTranslation();

    const itemsSearch = useItemsSearch();
    const itemsStore = useItemsStore(itemsSearch.state);

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
        onSubmit: async (values, helpers) => {
            const toastId = toastLoad("Updating...")
            try {
                let response;
                if (!values['mapping_package_id']) values['mapping_package_id'] = null;
                values['project'] = sessionApi.getSessionProject();

                sectionApi.generateSHACL()

                helpers.setStatus({success: true});
                helpers.setSubmitting(false);
                toastSuccess(sectionApi.SECTION_ITEM_TITLE + ' ' + (itemctx.isNew ? "created" : "updated"), toastId);
                if (response) {
                    if (itemctx.isNew) {
                        router.push({
                            pathname: paths.app[sectionApi.section].index,
                            query: {id: response._id}
                        });
                    } else if (itemctx.isStateable) {
                        itemctx.setState(response);
                    }
                }
            } catch (err) {
                console.error(err);
                toastError(err, toastId);
                helpers.setStatus({success: false});
                helpers.setErrors({submit: err.message});
                helpers.setSubmitting(false);
            }
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
                                    <PlusIcon/>
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
                                    <RefreshIcon/>
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            {t(tokens.nav.generate_cm_assertions_queries)}
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <ListSearch onFiltersChange={itemsSearch.handleFiltersChange}
                                onDetailedViewChange={itemsSearch.handleDetailedViewChange}
                                detailedView={itemsSearch.state.detailedView}
                    />
                    <ListTable
                        onPageChange={itemsSearch.handlePageChange}
                        onRowsPerPageChange={itemsSearch.handleRowsPerPageChange}
                        page={itemsSearch.state.page}
                        items={itemsStore.items}
                        count={itemsStore.itemsCount}
                        rowsPerPage={itemsSearch.state.rowsPerPage}
                        sectionApi={sectionApi}
                        onSort={itemsSearch.handleSorterChange}
                        sort={{direction: itemsSearch.state.sortDirection, column: itemsSearch.state.sortField}}
                        detailedView={itemsSearch.state.detailedView}
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
                                // isRequired={sectionApi.isMappingPackageRequired ?? false}
                                // withDefaultPackage={itemctx.isNew}
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
                                label="Close SHACL"
                                value="cleanup_project"
                            />
                            <Button type='submit'
                                    variant="contained"
                                    fullWidth
                                    size="small"
                                    color="success"
                                // disabled={formik.isSubmitting}
                                // onClick={handleTripleMapFragmentUpdate}
                            >
                                Generate
                            </Button>
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
