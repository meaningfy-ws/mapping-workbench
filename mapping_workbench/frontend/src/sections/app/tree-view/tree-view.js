import {useEffect, useState} from "react";

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {TreeItem, treeItemClasses} from "@mui/x-tree-view";
import Stack from "@mui/material/Stack";


const TreeView = (props) => {
    const {sectionApi} = props;

    const [state, setState] = useState([])

    useEffect(() => {
        getTheTree()
    }, []);


    const getTheTree = () => {
        sectionApi.getItemsTree()
            .then(res => setState(res))
            .catch(err => console.error(err))
    }

    const treeMenu = (item) => {
        return (
            <TreeItem key={item.id}
                      itemId={item.id}
                      label={item.label}
                        onClick={(e)=>console.log(e)}>
                {item.children?.map(e => treeMenu(e))}
            </TreeItem>
        )
    }

    const FileIcon = () => <InsertDriveFileIcon />
    const CollapseIcon = () => <Stack direction='row'><ExpandMoreIcon/><FolderIcon/></Stack>
    const ExpandIcon = () => <Stack direction='row'><ChevronRightIcon/><FolderIcon/></Stack>

    return(
        <SimpleTreeView slots={{
            expandIcon: ExpandIcon,
            collapseIcon: CollapseIcon,
            endIcon: FileIcon
        }}
         sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1,
             [`& .${treeItemClasses.iconContainer}`]: { width: 40, color: 'gray'} }}>
            {state?.map(treeMenu)}
        </SimpleTreeView>
    )
}

export default TreeView