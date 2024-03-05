import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

const CoverageFiles = ({files, onClick, tab}) => {
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
                        <ListItemButton onClick={() => onClick(file, tab)}>
                            <ListItemText primary={file.identifier} />
                        </ListItemButton>
                    </ListItem>)}
            </List>
        </>
    )
}

export default CoverageFiles