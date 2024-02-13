import {useEffect, useState} from "react";

import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Input from "@mui/material/Input";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";


const ItemSearchInput = ({onFiltersChange}) => {

    const [filters, setFilters] = useState([])
    const [searchInput,setSearchInput] = useState("")

    useEffect(()=> {
        onFiltersChange(filters)
    },[filters])
    const handleQueryChange = (event) => {
        event.preventDefault();
        if(!filters.includes(event.target[0].value))
            setFilters(e=> ([...e, event.target[0].value]))
        setSearchInput("")
    }

    const handleChipDelete = (event) => {
        const chipIndex = filters.indexOf(event)
        setFilters(filters.toSpliced(chipIndex,1))
    }

    return (
        <>
            <Stack
                alignItems="center"
                component="form"
                direction="row"
                onSubmit={handleQueryChange}
                spacing={2}
                sx={{p: 2}}
            >
                <SvgIcon>
                    <SearchMdIcon/>
                </SvgIcon>
                <Input
                    value={searchInput}
                    id="q"
                    onChange={e => setSearchInput(e.target.value)}
                    disableUnderline
                    fullWidth
                    placeholder="Search"
                    sx={{flexGrow: 1}}
                    onSubmit={handleQueryChange}
                />
            </Stack>
            <Divider/>
            {filters.length
                ? (
                    <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                        sx={{p: 2}}
                    >
                        {filters.map((chip, index) => (
                            <Chip
                                key={index}
                                label={(
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                        }}
                                    >
                                      {chip}
                                    </Box>
                                )}
                                onDelete={() => handleChipDelete(chip)}
                                variant="outlined"
                            />
                        ))}
                    </Stack>
                )
                : (
                    <Box sx={{p: 2.5}}>
                        <Typography
                            color="text.secondary"
                            variant="subtitle2"
                        >
                            No filters applied
                        </Typography>
                    </Box>
                )}
            <Divider/>
        </>
    )
}

export default  ItemSearchInput