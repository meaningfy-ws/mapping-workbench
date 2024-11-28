import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

import DialogContent from '@mui/material/DialogContent';
import {PropertyList} from '../../../components/property-list';
import {PropertyListItem} from '../../../components/property-list-item';
import {useHighlighterTheme} from '../../../hooks/use-highlighter-theme';

export const XpathDialog = ({item, open, handleClose}) => {
    const syntaxHighlighterTheme = useHighlighterTheme()

    return (
        <Dialog open={open}
                onClose={handleClose}>
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
                    Fields Overview XPaths
                </Typography>
                <IconButton
                    color="inherit"
                    onClick={handleClose}
                >
                    <CloseIcon/>
                </IconButton>
            </Stack>

            <DialogContent>
                <Grid container>
                    <Grid
                        item
                        md={12}
                        xs={12}
                    >
                        <PropertyList>
                            <PropertyListItem
                                label="Absolute XPath"
                                value={
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
                                        {item.absolute_xpath}
                                    </SyntaxHighlighter>
                                }
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    px: 3,
                                    py: 1.5
                                }}
                            />
                            <PropertyListItem
                                label="Relative XPath"
                                value={
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
                                        {item.relative_xpath}
                                    </SyntaxHighlighter>
                                }
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    px: 3,
                                    py: 1.5
                                }}
                            />
                        </PropertyList>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}