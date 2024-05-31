import {useEffect, useState, forwardRef} from "react";
import * as PropTypes from "prop-types";

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
    TreeItem2Checkbox, TreeItem2Content, TreeItem2GroupTransition,
    TreeItem2Icon,
    TreeItem2IconContainer, TreeItem2Label,
    TreeItem2Provider,
    TreeItem2Root
} from "@mui/x-tree-view";
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Icon from "@mui/material/Icon";
import {unstable_useTreeItem2 as useTreeItem2} from "@mui/x-tree-view/useTreeItem2";
import Box from "@mui/system/Box";
import {styled} from "@mui/material/styles";

function CustomTreeItemContent(props) {
    return null;
}

CustomTreeItemContent.propTypes = {
    onClick: PropTypes.func,
    ref: PropTypes.func,
    onMouseDown: PropTypes.func,
    status: PropTypes.any,
    children: PropTypes.node
};
const TreeView = (props) => {
    const {sectionApi} = props;

    const [state, setState] = useState([])

    useEffect(() => {
        getTheTree()
    }, []);

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(1, 1),
}));

// eslint-disable-next-line react/display-name
const CustomTreeItem = forwardRef((props, ref) => {
  const { id, itemId, label, disabled, children, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  return (
    <TreeItem2Provider itemId={itemId}>
      <TreeItem2Root {...getRootProps(other)}>
        <CustomTreeItemContent {...getContentProps()}>
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {children ? <FolderIcon/> : <InsertDriveFileIcon/>}
            <TreeItem2Label {...getLabelProps()} />
          </Box>
        </CustomTreeItemContent>
        {children && <TreeItem2GroupTransition {...getGroupTransitionProps()} />}
      </TreeItem2Root>
    </TreeItem2Provider>
  );
});

    const getTheTree = () => {
        sectionApi.getItemsTree()
            .then(res => setState(res))
            .catch(err => console.error(err))
    }

    const treeMenu = (item) => {
        return (
            <CustomTreeItem key={item.id}
                      slots={{icon:<Icon><FolderIcon/></Icon>}}
                      itemId={item.id}
                      label={item.label}
                        onClick={(e)=>console.log(e)}>
                {item.children?.map(e => treeMenu(e))}
            </CustomTreeItem>
        )
    }

    return(
        <SimpleTreeView>
            {state?.map(treeMenu)}
        </SimpleTreeView>
    )
}

export default TreeView