import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {TreeItem} from "@mui/x-tree-view";
import {useEffect, useState} from "react";

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
            <TreeItem itemId={item.id}
                      label={item.label}>
                {item.children?.map(e => treeMenu(e))}
            </TreeItem>
        )
    }

    return(
        <SimpleTreeView>
            {state?.map(e => treeMenu(e))}
        </SimpleTreeView>
    )
}

export default TreeView