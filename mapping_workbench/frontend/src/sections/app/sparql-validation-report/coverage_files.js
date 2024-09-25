import FileIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/FolderOpen';

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

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
                            <ListItemText primary={file.identifier} />
                        </ListItemButton>
                    </ListItem>)}
            </List>
        </>
    )
}

export default CoverageFiles