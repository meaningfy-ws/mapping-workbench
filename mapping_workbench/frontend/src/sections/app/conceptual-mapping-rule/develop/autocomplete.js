import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

const Autocomplete = ({formik, name, disabled}) => {

    const formikValue = formik.values[name]

    const handleSelect = (type, value) => {
        if (type === 'classOrList')
            formik.setFieldValue(name,[...formikValue, {type: value.type, value: value.title}]);
        else formik.setFieldValue(name, [...formikValue, {type, value}]);
    }

    const chipColor = (type) => {
        return type === 'class'
                    ? 'success'
                    : type === 'property'
                        ? 'warning'
                        : 'info'
    }

    const currentType = () => {
        if(!formikValue.length) {
            return 'class'
        }
        let last = [...formikValue]
            last = last.pop().type
        switch (last) {
            case 'class':
                return 'property'
            case 'property':
                return 'classOrList'
            default:
                return 'controlled_list'
        }
    }

    const currentName = (value) => {
        switch (value) {
            case 'class':
                return 'Class'
            case 'property':
                return 'Property'
            case 'classOrList':
                return 'Class Or List'
            default:
                return'Complete'
        }
    }

    const currentOptions = () => {
        switch(currentType()) {
            case 'class':
                return data.class
            case 'property':
                return data.property
            case 'classOrList':
                return [...data.class.map(e=> ({type:'class',title:e})),...data.controlled_list.map(e=> ({type:'controlled_list',title:e}))]
            default:
                return []
        }
    }



    const handleChipDelete = (i) => formik.setFieldValue(name, formikValue.slice(0,i))

    return (
        <Stack>

            <MuiAutocomplete
                  id="autocomplete"
                  fullWidth
                  options={currentOptions()}
                  groupBy={option => currentType() === 'classOrList' ? option.type : false}
                  onChange={(e,value)=> handleSelect(currentType(), value)}
                  disabled={currentType() === 'controlled_list' || disabled}
                  getOptionLabel={option => currentType() === 'classOrList' ? option.title : option}
                  blurOnSelect
                  value={null}
                  renderInput={(params) => {
                      return (
                          <TextField
                                {...params}
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

const data =  {
        "class": [
            "epo:Notice",
            "epo:CompetitionNotice",
            "xsd:boolean",
            "epo:ProcurementServiceProvider",
            "epo:Procedure",
            "rdf:PlainLiteral",
            "rdf:langString",
            "epo:ExclusionGround",
            "xsd:decimal"
        ],
        "property": [
            "epo:hasNoticeType",
            "epo:refersToProcedure",
            "epo:hasOfficialLanguage",
            "epo:hasPublicationDate",
            "epo:hasLegalBasis",
            "epo:hasLegalBasisDescription",
            "epo:definesSpecificPlaceOfPerformance",
            "epo:foreseesContractSpecificTerm",
            "epo:hasBroadPlaceOfPerformance"
        ],
        "controlled_list": [
            "at-voc:language",
            "at-voc:main-activity",
            "at-voc:legal-basis",
            "at-voc:number-threshold",
            "at-voc:country",
            "at-voc:number-fixed",
            "at-voc:nuts",
            "at-voc:other-place-service",
            "at-voc:criterion"
        ]
}

export default Autocomplete