import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const CoverageFiles = ({files, onClick, tab}) => {
    return (
        <List>
            {files.map(file=>
                <ListItem key={file.oid}
                          disablePadding>
                    <ListItemButton onClick={() => onClick(file, tab)}>
                        <ListItemText primary={file.identifier} />
                    </ListItemButton>
                </ListItem>)}
        </List>
    )
}

export default CoverageFiles