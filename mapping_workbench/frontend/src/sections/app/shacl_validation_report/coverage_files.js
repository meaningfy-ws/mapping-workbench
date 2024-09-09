import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import FolderIcon from '@mui/icons-material/FolderOpen';
import FileIcon from '@mui/icons-material/Description';

import ListItemIcon from "@mui/material/ListItemIcon";

const CoverageFiles = ({files, fileIcon, onClick}) => {
    return (
        <>
            <Typography m={2}
                            variant="h4">
                    Test set summary
            </Typography>
            <List>
                {files.map(file=>
                    <ListItem key={file.oid}
                              disablePadding>
                        <ListItemButton onClick={() => onClick(file)}>
                            <ListItemIcon>{fileIcon ? <FileIcon/> : <FolderIcon/>}</ListItemIcon>
                            <ListItemText primary={file.identifier ?? file.title} />
                        </ListItemButton>
                    </ListItem>)}
            </List>
        </>
    )
}

export default CoverageFiles