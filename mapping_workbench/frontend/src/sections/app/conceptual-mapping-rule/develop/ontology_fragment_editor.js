import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

const OntologyFragmentEditor = ({formik, name, disabled, data, required}) => {

    const formikValue = formik.values[name]

    const chipColor = (type) => {
        return type === 'CLASS'
                    ? 'success'
                    : type === 'PROPERTY'
                        ? 'warning'
                        : 'info'
    }

    const currentType = () => {
        if(!formikValue.length) {
            return 'CLASS'
        }
        let last = [...formikValue]
            last = last.pop().type
        switch (last) {
            case 'CLASS':
                return 'PROPERTY'
            case 'PROPERTY':
                return 'classOrDataType'
            default:
                return 'DATA_TYPE'
        }
    }

    const currentName = (value) => {
        switch (value) {
            case 'CLASS':
                return 'Class'
            case 'PROPERTY':
                return 'Property'
            case 'classOrDataType':
                return 'Class or Data Type'
            default:
                return'Complete'
        }
    }

    const currentOptions = () => {
        switch(currentType()) {
            case 'CLASS':
                return data.filter(e => e.type === 'CLASS')
            case 'PROPERTY':
                return data.filter(e => e.type === 'PROPERTY')
            case 'classOrDataType':
                return data.filter(e => ['DATA_TYPE','CLASS'].includes(e.type))
            default:
                return []
        }
    }

    const handleChange = (type, value) => formik.setFieldValue(name, [...formikValue, {type, value}])

    const handleChipDelete = (i) => formik.setFieldValue(name, formikValue.slice(0,i))

    return (
        <Stack>
            <MuiAutocomplete
                  id="autocomplete"
                  fullWidth
                  options={currentOptions()}
                  groupBy={option => currentType() === 'classOrDataType' ? option.type : false}
                  onChange={(e,value)=> handleChange(value.type, value.title)}
                  disabled={currentType() === 'DATA_TYPE' || disabled}
                  getOptionLabel={option => option.title}
                  blurOnSelect
                  value={null}
                  renderInput={(params) => {
                      return (
                          <TextField
                                {...params}
                                required={required}
                                sx={{marginTop:0}}
                                label={currentName(currentType())}
                                margin="normal"/>
                          )}}
            />
            <Stack direction='column'
                   gap={1}>
                {formikValue.map((e, i) => <Chip key = {'chip'+i}
                                                 label={<><b>{e.type} - </b>{e.value}</>}
                                                 onDelete={() => handleChipDelete(i)}
                                                 color={chipColor(e.type)}
                                                />)}
            </Stack>
        </Stack>
    )
}

export default OntologyFragmentEditor