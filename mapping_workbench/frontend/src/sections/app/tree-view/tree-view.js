import {useEffect, useState} from "react";

import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {TreeItem, treeItemClasses} from "@mui/x-tree-view";
import Stack from "@mui/material/Stack";
import AlbumIcon from '@mui/icons-material/Album';
import AdjustIcon from '@mui/icons-material/Adjust';
import CircularProgress from "@mui/material/CircularProgress";
import {TableErrorFetching, TableNoData} from "../shacl_validation_report/utils";

const TreeView = (props) => {
    const {sectionApi} = props;

    const [state, setState] = useState({items: []})

    useEffect(() => {
        getTheTree()
    }, []);

    const getTheTree = () => {
        setState(e => ({...e, loading: true, error: false}))
        sectionApi.getItemsTree()
            .then(res => setState(e => ({...e, items: res, loading: false})))
            .catch(err => {
                setState(e => ({...e, error: true}))
                console.error(err)
            })
    }

    const treeMenu = (item, idx) => {
        const itemId = `${idx}_${item.id}`
        return (
            <TreeItem key={itemId}
                      itemId={itemId}
                      label={item.label}
                      onClick={(e) => console.log(e)}>
                {item.children?.map(child => treeMenu(child, ++idx))}
            </TreeItem>
        )
    }

    const FileIcon = () => <AdjustIcon sx={{marginLeft: '17px'}}/>
    const CollapseIcon = () => <Stack direction='row'><ExpandMoreIcon/><AlbumIcon/></Stack>
    const ExpandIcon = () => <Stack direction='row'><ChevronRightIcon/><AlbumIcon/></Stack>


    if (state.error)
        return <TableErrorFetching/>

    if (state.loading) {
        return <Stack justifyContent="center"
        direction="row">
            <CircularProgress/>
        </Stack>
    }

    if (!state.items?.length)
        return <TableNoData/>

    return (
        <SimpleTreeView slots={{
            expandIcon: ExpandIcon,
            collapseIcon: CollapseIcon,
            endIcon: FileIcon
        }}
                        sx={{
                            overflowX: 'hidden', minHeight: 270, flexGrow: 1,
                            [`& .${treeItemClasses.iconContainer}`]: {minWidth: 40, color: 'gray'}
                        }}>
            {state.items?.map(item => treeMenu(item, 0))}
        </SimpleTreeView>
    )
}

export default TreeView