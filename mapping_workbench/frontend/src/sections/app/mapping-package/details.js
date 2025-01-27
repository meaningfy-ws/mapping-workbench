import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";

import {PropertyList} from "../../../components/property-list";
import {PropertyListItem} from "../../../components/property-list-item";

const MappingPackageDetails = ({item}) => {
    return (
        <Grid container
              spacing={3}>
            <Grid md={12}
                  xs={12}>
                <Card>
                    <CardContent>
                        <Grid
                            item={item}
                            md={12}
                            xs={12}
                        >
                            <PropertyList>
                                <PropertyListItem
                                    label="Description"
                                    value={item.description}
                                    sx={{
                                        whiteSpace: "pre-wrap",
                                        px: 3,
                                        py: 1.5
                                    }}
                                />
                                <Divider/>
                                <Grid container
                                      spacing={3}>
                                    <Grid md={6}
                                          xs={12}>
                                        <PropertyListItem
                                            label="Identifier"
                                            value={item.identifier}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="Mapping Version"
                                            value={item.mapping_version}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="EPO Version"
                                            value={item.epo_version}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="eForms Subtype"
                                            value={item.eform_subtypes.join(', ')}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="Start Date"
                                            value={item.start_date}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="End Date"
                                            value={item.end_date}
                                        />
                                    </Grid>
                                    <Grid md={12}
                                          xs={12}>
                                        <PropertyListItem
                                            label="eForms SDK version"
                                            value={item.eforms_sdk_versions.join(', ')}
                                        />
                                    </Grid>
                                </Grid>
                            </PropertyList>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default MappingPackageDetails