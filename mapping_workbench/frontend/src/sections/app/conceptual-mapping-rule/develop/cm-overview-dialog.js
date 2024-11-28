import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {PropertyList} from '../../../../components/property-list';
import {PropertyListItem} from '../../../../components/property-list-item';
import {useHighlighterTheme} from '../../../../hooks/use-highlighter-theme';

export const CmOverviewDialog = ({open, handleClose, item = {}}) => {
    const syntaxHighlighterTheme = useHighlighterTheme()

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='md'
        >

            <DialogTitle>
                CM Rules Overview
            </DialogTitle>
            <DialogContent>
                <Grid container
                      rowSpacing={2}>
                    <Grid item
                          xl={6}
                          md={12}>
                        <PropertyList>
                            {item.source_structural_element && (
                                <>
                                    <Typography variant='h5'>
                                        Source
                                    </Typography>
                                    {item.source_structural_element.sdk_element_id && <PropertyListItem
                                        key="sdk_element_id"
                                        label="Field/Node ID"
                                        value={item.source_structural_element.sdk_element_id}
                                    />}
                                    {item.source_structural_element.name && <PropertyListItem
                                        key="name"
                                        label="Field Name"
                                        value={item.source_structural_element.name}
                                    />}
                                    {item.source_structural_element.absolute_xpath && <PropertyListItem
                                        key="absolute_xpath"
                                        label="Absolute XPath"
                                    >
                                        <SyntaxHighlighter
                                            language="xquery"
                                            wrapLines
                                            style={syntaxHighlighterTheme}
                                            lineProps={{
                                                style: {
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'pre-wrap'
                                                }
                                            }}>
                                            {item.source_structural_element.absolute_xpath}
                                        </SyntaxHighlighter>
                                    </PropertyListItem>}
                                </>
                            )}
                        </PropertyList>
                    </Grid>
                    <Grid item
                          xl={6}
                          md={12}>
                        {!!(item.target_class_path_terms_validity?.length || item.target_property_path_terms_validity?.length) &&
                            <PropertyList>
                                <Typography variant='h5'>
                                    Target
                                </Typography>
                                {!!item.target_class_path_terms_validity?.length &&
                                    <PropertyListItem label='Ontology Fragment Class path'>
                                        <SyntaxHighlighter
                                            language="sparql"
                                            wrapLines
                                            style={syntaxHighlighterTheme}
                                            lineProps={{
                                                style: {
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'pre-wrap'
                                                }
                                            }}>
                                            {item.target_class_path}
                                        </SyntaxHighlighter>
                                    </PropertyListItem>}
                                {!!item.target_property_path_terms_validity?.length &&
                                    <PropertyListItem label='Ontology Fragment Property path'>
                                        <SyntaxHighlighter
                                            language="sparql"
                                            wrapLines
                                            style={syntaxHighlighterTheme}
                                            lineProps={{
                                                style: {
                                                    wordBreak: 'break-all',
                                                    whiteSpace: 'pre-wrap'
                                                }
                                            }}>
                                            {item.target_property_path}
                                        </SyntaxHighlighter>
                                    </PropertyListItem>}
                            </PropertyList>}
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}