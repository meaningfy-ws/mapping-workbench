import * as React from "react";
import {useEffect, useState} from "react";
import MenuItem from "@mui/material/MenuItem";
import {genericTripleMapFragmentsApi} from "../../../../../api/triple-map-fragments/generic";
import {useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Input from "@mui/material/Input";


export const GenericTripleMapFragmentListSelector = (props) => {
    const {tripleMapFragments = [], initProjectTripleMapFragments = [], ...other} = props;
    const [tripleMapFragmentsValues, setTripleMapFragmentsValues] = useState(tripleMapFragments);
    const [projectTripleMapFragments, setProjectTripleMapFragments] = useState(initProjectTripleMapFragments);
    const [projectTripleMapFragmentsMap,
        setProjectTripleMapFragmentsMap] = useState({});

    useEffect(() => {
        (async () => {
            if (initProjectTripleMapFragments.length === 0) {
                setProjectTripleMapFragments(await genericTripleMapFragmentsApi.getProjectTripleMapFragments());
            }
        })()
    }, [genericTripleMapFragmentsApi])

    useEffect(() => {
        (() => {
            setProjectTripleMapFragmentsMap(projectTripleMapFragments.reduce((a, b) => {
                a[b['id']] = b['uri'];
                return a
            }, {}));
        })()
    }, [projectTripleMapFragments])

    const handleChange = (event) => {
        const {
            target: {value},
        } = event;
        let values = (typeof value === 'string' ? value.split(',') : value);
        tripleMapFragments.length = 0;
        for (let v of values) {
            tripleMapFragments.push(v);
        }
        setTripleMapFragmentsValues(values);
    };

    return (
        <FormControl sx={{m: 1, width: '100%'}}>
            <InputLabel id="demo-multiple-chip-label">Triple Map Fragments</InputLabel>
            <Select
                sx={{width: '100%'}}
                multiple
                value={tripleMapFragmentsValues}
                onChange={handleChange}
                input={<Input id="select-multiple-chip" label="Triple Map Fragment"/>}
                renderValue={(selected) => {
                    return (
                        <Box p={1} sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5, width: '100%'}}>
                            {selected.map((triple_map_fragment) => (
                                <Chip key={triple_map_fragment}
                                      label={projectTripleMapFragmentsMap[triple_map_fragment]}/>
                            ))}
                        </Box>
                    )
                }}
            >
                {projectTripleMapFragments.map((project_triple_map_fragment) => (
                    <MenuItem
                        key={project_triple_map_fragment.id}
                        value={project_triple_map_fragment.id}
                    >
                        {project_triple_map_fragment.uri}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
