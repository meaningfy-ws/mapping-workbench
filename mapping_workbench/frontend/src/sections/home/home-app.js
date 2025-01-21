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
        {href: paths.app.fields_and_nodes.develop.index, label: 'Specify'},
        {href: paths.app.fields_and_nodes.overview.index, label: 'Overview'},
        {href: paths.app.fields_and_nodes.tree_view.index, label: 'Tree View'},
        {href: paths.app.conceptual_mapping_rules.develop.index, label: 'Create'},
        {href: paths.app.conceptual_mapping_rules.overview.index, label: 'Overview'},
        {href: paths.app.conceptual_mapping_rules.review.index, label: 'Review'},
        {href: paths.app.triple_map_fragments.index, label: 'Implement'},
        {href: paths.app.value_mapping_resources.index, label: 'Add'},
        {href: paths.app.sparql_test_suites.index, label: 'Generate'},
        {href: paths.app.shacl_test_suites.index, label: 'Add SHACL shapes'},
        {href: paths.app.sparql_test_suites.index, label: 'SPARQL ASK assertions'},
        {href: paths.app.mapping_packages.index, label: 'Organise'},
        {href: paths.app.mapping_packages.index, label: 'Process'},
        {href: paths.app.value_mapping_resources.index, label: 'Review'},
        {href: paths.app.mapping_packages.index, label: 'Export'}
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
                <Typography variant="h6" lineHeight='24px'>
                    Welcome to Mapping Workbench 🙌! This is a collaborative platform designed to map XML schemas to OWL
                    ontologies, enhancing the efficiency and accuracy of large semantic mapping projects. In this
                    integrated environment, you will find centralised all necessary resources for an agile execution of
                    activities throughout the mapping development lifecycle.
                </Typography>
                <Typography variant="h6"
                            sx={{mb: 3}}>

                </Typography>
                <Typography variant='subtitle1'>A simplified view of the mapping lifecycle is depicted in Figure 1. Next, we provide you
                    with a wizard meant to guide through a series of concrete steps from A to Z of a successful mapping
                    project. Each step will lead you to the specific page in the MWB.</Typography>
                <Image src={schemaImage}
                       width={800}
                       alt={'schema image'}/>
                <Box>
                    <Typography sx={{textAlign: 'center'}}>
                        Figure 1. MWB Mapping workflow.
                    </Typography>
                    <Typography variant='h6'
                                sx={{mt: 2}}>
                        Setup Project 🔧
                    </Typography>
                    <ul>
                        <li>
                            <Typography>Step 1: Set up your Project 🛠️</Typography>
                            <Typography sx={{my: 1}}>
                                Start with {links[0]}. This will bind your mapping scope.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 2: Organise test data (i.e. XML files) 📁
                            </Typography>
                            <Typography sx={{my: 1}}>{links[1]} some sample documents in XML format, and organise them
                                as Test Data Suites. They will help you to define the Fields & Nodes used for mapping
                                and
                                perform mapping validation.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 3: Add a Ontology files 🌐
                            </Typography>
                            <Typography sx={{my: 1}}>{links[2]} your ontology file(s) to define the ontology terms for
                                your conceptual mapping.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 4: Browse Ontology Terms and Namespaces, if necessary 🔤
                            </Typography>
                            <Typography sx={{my: 1}}>{links[3]} our mechanism that reads the relevant terms from your
                                ontology file. Use this step to register additional namespaces used for Conceptual
                                Mapping.
                            </Typography>
                        </li>
                    </ul>
                    <Typography variant='h6'
                                sx={{mb: 2}}>
                        Define XML Fields & Nodes
                    </Typography>
                    <Typography sx={{fontStyle: 'italic'}}>
                        Here we identify concepts in the source data structure to be mapped. You can literally pinpoint
                        concepts in your source data with XPath expressions. Fields are the Leaf XPaths, Nodes are
                        intermediary non-leaf XPaths that need to be mapped.
                    </Typography>
                    <ul>
                        <li>
                            <Typography>
                                Step 5: Define Fields & Nodes 🏷️
                            </Typography>
                            <Typography sx={{my: 1}}>{links[4]} the fields and nodes in your data structure. This
                                involves detailing the data points and hierarchical relationships that will be used in
                                your mapping process.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 6: Revise the Fields & Nodes, if needed 🎗
                            </Typography>
                            <Typography sx={{my: 1}}>
                                Look at the {links[5]} or the {links[6]} to gain perspective.
                            </Typography>
                        </li>
                    </ul>
                    <Typography variant='h6'
                                sx={{mb: 2}}>
                        Define Conceptual Mappings (CM)
                    </Typography>
                    <Typography sx={{fontStyle: 'italic'}}>
                        Here we express how concepts in the source data relate to concepts in the target ontology. We
                        also specify the context in which the target ontology is to be instantiated with “ontology
                        fragments”. An ontology fragment is an alternating sequence of classes and properties.
                        Conceptual mappings serve as requirement specifications to be implemented in the Technical
                        Mappings and as a source for automated testing.
                    </Typography>
                    <ul>
                        <li>
                            <Typography>
                                Step 7: Define Conceptual Mapping rules 🔗
                            </Typography>
                            <Typography sx={{my: 1}}>{links[7]} rules that specify how the concept of a Field or Node
                                corresponds to a concept in the ontology. These rules will guide the implementation of
                                RML transformation rules, and the validation of the transformation rules against the
                                test data.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 8: Revise the Conceptual Mappings, if needed 🤔
                            </Typography>
                            <Typography sx={{my: 1}}> Look at the CM {links[8]} or the CM {links[9]} to gain
                                perspective.
                            </Typography>
                        </li>
                    </ul>
                    <Typography variant='h6'
                                sx={{mb: 2}}>
                        Implement Technical Mappings (TM)
                    </Typography>
                    <Typography sx={{fontStyle: 'italic'}}>
                        Here we write RML rules that implement the CMs.
                    </Typography>
                    <ul>
                        <li>
                            <Typography>
                                Step 9: Implement RML Mapping rules 🔧
                            </Typography>
                            <Typography sx={{my: 1}}>{links[10]} the RML rules following the specifications from the
                                CMs. Execute the Rules in place for a quick validation against a sample file.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 10: Add Value Mapping resources, if necessary 🧾
                            </Typography>
                            <Typography sx={{my: 1}}>Value Mappings are best organised in correspondence files (usually
                                in CSV, JSON, XML formats). {links[11]} Value Mapping files.
                            </Typography>
                        </li>
                    </ul>
                    <Typography variant='h6'
                                sx={{mb: 2}}>
                        Validate Mapping Rules (by Mapping Package)
                    </Typography>
                    <Typography sx={{fontStyle: 'italic'}}>
                        Here we validate the mapping rules and the output data, i.e. that the right rules were
                        implemented the right way, and that the data meets the expected data shape. We rely on SPARQL
                        tests (automatically generated from CMs) and SHACL data shapes (application profiles) provided
                        by the ontology developers.
                    </Typography>
                    <ul>
                        <li>
                            <Typography>
                                Step 11: Create Test Suites (SHACL and/or SPARQL) 🧪
                            </Typography>
                            <Typography sx={{my: 1}}>{links[12]} Unit Tests with SPARQL ASK assertions from the CM
                                rules.
                            </Typography>
                            <Typography sx={{my: 1}}>
                                {links[13]} and custom {links[14]} as necessary.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 12: Package your Mappings Rules 🧳
                            </Typography>
                            <Typography sx={{my: 1}}>{links[15]} your resources and mapping
                                rules in Mapping Packages. Large and complex projects need this, or use the “Default”
                                package for simpler projects.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 13: Transform and Validate a Mapping Package 📦
                            </Typography>
                            <Typography sx={{my: 1}}> Once the resources and mapping rules are in place, {links[16]} a
                                Mapping Package. It will transform the selected sample data and run the validation on
                                the result, generating SPARQL and SHACL reports.
                            </Typography>
                        </li>
                        <li>
                            <Typography>
                                Step 14: Validate results by consulting validation reports 🔍
                            </Typography>
                            <Typography sx={{my: 1}}>{links[17]} the results of your mapping (by consulting validation
                                reports) to ensure accuracy and consistency of the mapping.
                            </Typography>
                        </li>
                    </ul>
                    <Typography variant='h6'
                                sx={{mb: 2}}>
                        Deploy Mapping Package
                    </Typography>
                    <Typography sx={{fontStyle: 'italic'}}>
                        When you are happy with the mapping rules in a package, you can deploy it to a transformation
                        pipeline.
                    </Typography>
                    <ul>
                        <li>
                            <Typography>
                                Step 15: Export Mapping Package 📤
                            </Typography>
                            <Typography sx={{my: 1}}>{links[18]} your finalized
                                mapping package for use in your production environment or for sharing with other
                                stakeholders.
                            </Typography>
                        </li>
                    </ul>
                </Box>
            </Box>
        </Box>
    );
};
