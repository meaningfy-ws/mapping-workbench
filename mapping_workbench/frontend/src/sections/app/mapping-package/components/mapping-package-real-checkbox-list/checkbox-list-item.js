import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";


export const MappingPackageCheckboxListItem = (props) => {
    const {
        mappingPackage,
        mappingPackages,
        handleMappingPackageChange,
        ...other
    } = props;

    const isChecked = mappingPackages?.includes(mappingPackage.id);

    return (
        <FormControlLabel
            sx={{
                width: '100%'
            }}
            control={
                <Checkbox
                    checked={isChecked}
                    onChange={(event) => handleMappingPackageChange(mappingPackage.id, event.target.checked)}
                />
            }
            label={mappingPackage.title}
            value={mappingPackage.id}
        />
    )

}