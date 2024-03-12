import {useCallback, useEffect, useState} from "react";
import {specificTripleMapFragmentsApi} from "../../../api/triple-map-fragments/specific";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import {ListSelectorSelect as ResourceListSelector} from "../../../components/app/list-selector/select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import toast from "react-hot-toast";

const TripleMapping = (props) => {
    const {id} = props
    const [tripleMapFragments, setTripleMapFragments] = useState([]);

    useEffect(() => {
        getTripleMapFragments()
    }, [specificTripleMapFragmentsApi, id])

     const getTripleMapFragments = async () => {
        setTripleMapFragments((await specificTripleMapFragmentsApi.getValuesForSelector({
                filters: {
                    mapping_package: id
                }
            })).map(x => x.id))
    }

    const handleTripleMapFragmentsUpdate = async () => {
        await specificTripleMapFragmentsApi.update_specific_mapping_package(id, tripleMapFragments);
        toast.success(specificTripleMapFragmentsApi.SECTION_TITLE + ' updated');
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
                            valuesApi={specificTripleMapFragmentsApi}
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