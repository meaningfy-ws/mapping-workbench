import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import {RouterLink} from "../../components/router-link";
import {paths} from "../../paths";


export const HomeApp = () => {
    const theme = useTheme();

    return (
        <>
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
            <Typography variant="h6"
                        sx={{mb: 3}}>
                Welcome to Mapping Workbench 🙌. This tool will help you to develop and testing RML mapping rules,
                managing complexity of large data structures, and collaborative editing and validating with
                domain experts, in the manner of an Integrated Development Environment.
            </Typography>
            <Typography>Check our paper: {<Button variant="outlined"
                                                  type="link"
                                                  color="error"
                                                  href="https://example-files.online-convert.com/document/pdf/example.pdf"
                                                  startIcon={<PictureAsPdfIcon/>}>
                sem24_paper_182.pdf
            </Button>}</Typography>

            <Typography>The tutorial below will help you to get introduced into MWB by crossing a small mapping workflow
                (Figure 1).</Typography>
            <img
                src="blob:https://meaningfy.atlassian.net/534257b2-1350-46f0-b8d6-b62e949d56cc#media-blob-url=true&id=4c971686-eb53-48a3-a02e-ddd92cbda95e&contextId=2091188308&collection=contentId-2091188308"></img>
            <Typography variant='span'>
                Figure 1. MWB Mapping workflow.
                f

                In each step, you can find the link to the following page.
                <ul>
                    <li>
                        Step 1: Setup Project 🛠️

                        <Typography sx={{my: 1}}>Start with <Link component={RouterLink}
                                                                  href={paths.app.projects.index}>
                            creating a project</Link>. This will bound your mapping
                            scope.</Typography>
                    </li>
                    <li>
                        Step 2: Import a Test data (ex: XML) 📁

                        <Typography sx={{my: 1}}><Link component={RouterLink}
                                                       href={paths.app.ontology_files.index}>
                            Add</Link> some documents in XML format that will help you to define
                            the
                            structural elements used for mapping.</Typography>
                    </li>
                    <li>
                        Step 3: Add an Ontology File 🌐

                        <Typography sx={{my: 1}}><Link component={RouterLink}
                                                       href={paths.app.ontology_files.index}>
                            Upload</Link> your ontology file(s) to define the ontology
                            terms for
                            your conceptual mapping.</Typography>
                    </li>
                    <li>Step 4: Discover Terms 🔤

                        <Typography sx={{my: 1}}><Link component={RouterLink}
                                                       href={paths.app.ontology_terms.index}>
                            Use</Link> our mechanism that detects the relevant terms from your ontology
                            file. Use
                            this step to register these terms to the MWB for further using on conceptual
                            mapping.</Typography>
                    </li>
                    <li>Step 5: Define Fields & Nodes 🏷️

                        <Typography sx={{my: 1}}><Link component={RouterLink}
                                                       href={paths.app.fields_and_nodes.index}>
                            Specify</Link> the fields and nodes in your data structure. This
                            involves
                            detailing the data points and hierarchical relationships that will be used in your mapping
                            process.
                        </Typography></li>
                    <li> Step 6: Define Conceptual Mapping Rule 🔗
                        <Typography sx={{my: 1}}>
                            [Create](link to conceptual mapping rules page) rules that outline how data should be mapped
                            conceptually between the test data and the ontology. These rules will guide the
                            transformation of
                            data according to the defined relationships and structures.
                        </Typography></li>
                    <li> Step 7: Define Technical Mapping 🔧

                        <Typography sx={{my: 1}}><Link component={RouterLink}
                                                       href={paths.app.generic_triple_map_fragments.index}>
                            Develop</Link> the technical mapping fragments that represents
                            RML
                            rules which implements what is designed and specified by the Conceptual Mapping Rules.
                        </Typography></li>
                    <li>Step 8: Process a Mapping Package 📦

                        <Typography sx={{my: 1}}> Manage your project resources and the transformation process by <Link
                            component={RouterLink}
                            href={paths.app.mapping_packages.index}>
                            creating a mapping</Link> and run validation.
                        </Typography></li>
                    <li> Step 9: Validate results 🔍

                        <Typography sx={{my: 1}}> [Review](link to validation results page) the results of your mapping
                            process to ensure
                            accuracy and
                            consistency of the mapping.
                        </Typography></li>
                    <li> Step 10: Export Mapping Package 📤
                        <Typography sx={{my: 1}}><Link component={RouterLink}
                                                       href={paths.app.mapping_packages.index}>
                            Export</Link> your finalized mapping package for use in your
                            production
                            environment or for sharing with other stakeholders.
                        </Typography></li>
                </ul>

            </Typography>
        </>
    );
};
