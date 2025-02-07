import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {TreeItem, treeItemClasses} from '@mui/x-tree-view';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

import {Scrollbar} from 'src/components/scrollbar';

const FileList = ({files, handleFileChange, handleFolderChange, selectedPackageState, selectedTestDataset, maxHeight}) => {
    const FileIcon = () => <InsertDriveFileOutlinedIcon sx={{marginLeft: '17px'}}/>
    const CollapseIcon = () => <Stack direction='row'><ExpandMoreIcon/><FolderOpenIcon/></Stack>
    const ExpandIcon = () => <Stack direction='row'><ChevronRightIcon/><FolderOpenIcon/></Stack>

    return (
        <Paper sx={{height: '100%'}}>
            <Scrollbar style={{maxHeight}}>
                <Stack sx={{py: 2}}>
                    <Typography sx={{px: 2, mb: 3, fontWeight: 'bold', cursor: 'pointer'}}
                                onClick={() => handleFolderChange(undefined)}>
                        Test Set Summary
                    </Typography>
                    <SimpleTreeView slots={{
                        expandIcon: ExpandIcon,
                        collapseIcon: CollapseIcon,
                        endIcon: FileIcon
                    }}
                                    selectedItems={selectedTestDataset?.oid ?? selectedPackageState?.oid ?? ''}
                                    sx={{
                                        [`& .${treeItemClasses.iconContainer}`]: {minWidth: 40, color: 'gray'}
                                    }}>
                        {files?.map(item => <TreeItem key={item.oid}
                                                      itemId={item.oid}
                                                      label={item.title}

                                                      onClick={() => handleFolderChange(item)}>
                            {item.test_data_states?.map(child => <TreeItem key={child.oid}
                                                                           itemId={child.oid}
                                                                           label={child.title}
                                                                           onClick={() => {
                                                                               handleFolderChange(item)
                                                                               handleFileChange(child)
                                                                           }}>
                            </TreeItem>)}
                        </TreeItem>)}
                    </SimpleTreeView>
                </Stack>
            </Scrollbar>
        </Paper>
    )
}

export default FileList