import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import schemaImage from '../../../public/mwb-schema.png'
import {RouterLink} from "../../components/router-link";
import {paths} from "../../paths";
import Image from "next/image";
import {Box} from "@mui/system";

export const HomeApp = () => {
    const theme = useTheme();

    const linksTypes = [
        {href: paths.app.projects.create, label: 'creating a project'},
        {href: paths.app.ontology_files.index, label: 'Add'},
        {href: paths.app.ontology_files.index, label: 'Upload'},
        {href: paths.app.ontology_terms.index, label: 'Use'},
        {href: paths.app.fields_and_nodes.index, label: 'Specify'},
        {href: paths.app.conceptual_mapping_rules.develop.index, label: 'Create'},
        {href: paths.app.triple_map_fragments.index, label: 'Develop'},
        {href: paths.app.mapping_packages.index, label: 'creating a mapping'},
        {href: 'xxx', label: 'Review'},
        {href: paths.app.mapping_packages.index, label: 'Export'},
    ]

    const links = linksTypes.map(link => <Link key={link.label}
                                               component={RouterLink}
                                               href={link.href}>{link.label}</Link>)

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
            <Box sx={{maxWidth: 800}}>
                <Typography
                    variant="h2"
                    sx={{mb: 4}}
                >
                    <Typography
                        component="span"
                        color="primary.main"
                        variant="inherit"
                    >
                        Mapping Workbench
                    </Typography>
                </Typography>
                <Typography variant="h5"
                            sx={{mb: 3}}>
                    Welcome to Mapping Workbench 🙌. This tool will help you to develop and testing RML mapping rules,
                    managing complexity of large data structures, and collaborative editing and validating with
                    domain experts, in the manner of an Integrated Development Environment.
                </Typography>
                <Typography>Check our paper: {<Button variant="outlined"
                                                      type="link"
                                                      target="_blank"
                                                      color="error"
                                                      href={'/sem24_paper_182.pdf'}
                                                      startIcon={<PictureAsPdfIcon/>}>
                    sem24_paper_182.pdf
                </Button>}</Typography>
                <Typography>The tutorial below will help you to get introduced into MWB by crossing a small mapping
                    workflow
                    (Figure 1).</Typography>
                <br/>
                <Image src={schemaImage}
                       width={800}
                       alt={'schema image'}/>
                <br/>
                <Typography variant='span'>
                    Figure 1. MWB Mapping workflow.

                    In each step, you can find the link to the following page.
                    <ul>
                        <li>
                            <Typography variant='h6'>
                                Step 1: Setup Project 🛠️
                            </Typography>
                            <Typography sx={{my: 1}}>Start with {links[0]}. This will bound your mapping
                                scope.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 2: Import a Test data (ex: XML) 📁
                            </Typography>
                            <Typography sx={{my: 1}}>{links[1]} some documents in XML format that will help you to
                                define
                                the
                                structural elements used for mapping.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 3: Add an Ontology File 🌐
                            </Typography>
                            <Typography sx={{my: 1}}>{links[2]} your ontology file(s) to define the ontology
                                terms for
                                your conceptual mapping.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 4: Discover Terms 🔤
                            </Typography>
                            <Typography sx={{my: 1}}>{links[3]} our mechanism that detects the relevant terms from your
                                ontology
                                file. Use
                                this step to register these terms to the MWB for further using on conceptual
                                mapping.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 5: Define Fields & Nodes 🏷️
                            </Typography>
                            <Typography sx={{my: 1}}>{links[4]} the fields and nodes in your data structure. This
                                involves
                                detailing the data points and hierarchical relationships that will be used in your
                                mapping
                                process.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 6: Define Conceptual Mapping Rule 🔗
                            </Typography>
                            <Typography sx={{my: 1}}>
                                {links[5]} rules that outline how data should be mapped
                                conceptually between the test data and the ontology. These rules will guide the
                                transformation of
                                data according to the defined relationships and structures.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 7: Define Technical Mapping 🔧
                            </Typography>

                            <Typography sx={{my: 1}}>{links[6]} the technical mapping fragments that represents
                                RML
                                rules which implements what is designed and specified by the Conceptual Mapping Rules.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 8: Process a Mapping Package 📦
                            </Typography>

                            <Typography sx={{my: 1}}> Manage your project resources and the transformation process
                                by {links[7]} and run validation.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 9: Validate results 🔍
                            </Typography>

                            <Typography sx={{my: 1}}>{links[8]} the results of your mapping
                                process to ensure
                                accuracy and
                                consistency of the mapping.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='h6'>
                                Step 10: Export Mapping Package 📤
                            </Typography>
                            <Typography sx={{my: 1}}>{links[9]} your finalized mapping package for use in your
                                production
                                environment or for sharing with other stakeholders.
                            </Typography>
                        </li>
                    </ul>

                </Typography>
            </Box>
        </Box>
    );
};
