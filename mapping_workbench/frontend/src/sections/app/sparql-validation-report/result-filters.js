import Stack from '@mui/material/Stack';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {sparqlReportFiltersApi} from 'src/api/mapping-packages/reports/sparql/filters';
import {useState} from "react";

const Filters = ({setDispatchShowMatchedXPATHsOnly=null}) => {
    const showSessMatchedXPATHsOnly = sparqlReportFiltersApi.getShowMatchedXPATHsOnly();
    const [showMatchedXPATHsOnly, setShowMatchedXPATHsOnly] = useState(showSessMatchedXPATHsOnly);

    const setSessShowMatchedXPATHsOnly = (checked) => {
        sparqlReportFiltersApi.setShowMatchedXPATHsOnly(checked);
        setShowMatchedXPATHsOnly(checked);
        if (setDispatchShowMatchedXPATHsOnly) {
            setDispatchShowMatchedXPATHsOnly(checked);
        }
    }

    return (
        <Stack>
            <FormControlLabel
                sx={{
                    width: '100%',
                }}
                control={
                    <Switch
                        checked={showMatchedXPATHsOnly}
                        onChange={(event) => setSessShowMatchedXPATHsOnly(event.target.checked)}
                    />
                }
                label="show matched XPaths only"
            />
        </Stack>
    )
}

export const ResultFilters = ({setDispatchShowMatchedXPATHsOnly}) => {
    return <Filters setDispatchShowMatchedXPATHsOnly={setDispatchShowMatchedXPATHsOnly}/>
}
