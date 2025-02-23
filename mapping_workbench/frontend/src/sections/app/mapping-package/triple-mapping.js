import { useEffect, useState} from "react";

import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import {genericTripleMapFragmentsApi as tripleMapFragmentsApi} from "../../../api/triple-map-fragments/generic";
import {ListSelectorSelect as ResourceListSelector} from "../../../components/app/list-selector/select";
import {toastError, toastLoad, toastSuccess} from "../../../components/app-toast";

const TripleMapping = (props) => {
    const {id} = props
    const [tripleMapFragments, setTripleMapFragments] = useState([]);

    useEffect(() => {
        id && getTripleMapFragments()
    }, [id])

     const getTripleMapFragments = () => {
         tripleMapFragmentsApi.getValuesForSelector({filters: {mapping_package_id: id}})
             .then(res => {
                 const triple_map_ids = res.map(x => x.id);
                 setTripleMapFragments(triple_map_ids)
             })
    }

    const handleTripleMapFragmentsUpdate = async () => {
        const toastId = toastLoad(`Updating ${tripleMapFragmentsApi.SECTION_TITLE}...`)
        tripleMapFragmentsApi.update_mapping_package(id, tripleMapFragments)
            .then(res => toastSuccess(`${tripleMapFragmentsApi.SECTION_TITLE} Updated`, toastId))
            .catch(err => toastError(err, toastId))
    }


    return(
        <Card sx={{mt: 3}}>
            <CardHeader title="RML Triple Maps"/>
            <CardContent sx={{pt: 0}}>
                <Grid container
                      spacing={3}>
                    <Grid xs={12}
                          md={12}>
                        <ResourceListSelector
                            valuesApi={tripleMapFragmentsApi}
                            listValues={tripleMapFragments}
                            titleField="uri"
                        />
                        <FormControl>
                            <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={handleTripleMapFragmentsUpdate}
                            >
                                Update
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default TripleMapping