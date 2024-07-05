import {useState} from "react";

import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const Autocomplete = () => {
    const [state, setState] = useState({})

    const handleSelect = (value) => {
        !state.class
            ? setState(e => ({class: value}))
            : !state.property
                ? setState(e => ({class: e.class, property: value}))
                : setState(e=>({...e, controlled_list: value}))
    }

    const currentLabel =
        !state.class
            ? 'class'
            : !state.property
                ? 'property'
                : 'controlled_list'

    const currentName = (value) =>
        value === 'class'
            ? 'Class'
            : value === 'property'
                ? 'Property'
                : 'Controlled List'

    const currentOptions = data[currentLabel]


    const handleChipDelete = (value) => {
        if(value === 'class')
            setState({})
        if(value === 'property')
            setState(e=>({class:e.class}))
        if(value === 'controlled_list')
            setState(e=> ({class:e.class, property:e.property}))
    }

    const SuccessChip = ({value}) =>
        <Chip label={state[value]}
              color='success'
              onDelete={() => handleChipDelete(value)}/>

    const WarningChip = ({value}) =>
        <Chip label={currentName(value)}
              color={currentLabel===value ? 'warning' : 'default'}/>


    return (
        <Stack>
            <MuiAutocomplete
                  id="autocomplete"
                  fullWidth
                  options={currentOptions}
                  onChange={(e,value)=> handleSelect(value)}
                  disabled={!!state.controlled_list}
                  blurOnSelect
                  value={null}
                  renderInput={(params) => {
                      return (
                          <TextField
                                {...params}
                                label={currentName(currentLabel)}
                                margin="normal"/>
                          )}}
                  renderOption={(props, option, { inputValue }) => {
                    const { key, ...optionProps } = props;
                    const matches = match(option, inputValue, { insideWords: true });
                    const parts = parse(option, matches);

                    return (
                      <li key={key}
                          {...optionProps}>
                        <div>
                          {parts.map((part, index) => (
                            <span
                              key={index}
                              style={{
                                fontWeight: part.highlight ? 700 : 400,
                              }}
                            >
                              {part.text}
                            </span>
                          ))}
                        </div>
                      </li>
                    );
                     }}
                />
            <Stack direction='column'
                   gap={1}>
                {state.class ? <SuccessChip value='class'/>
                             : <WarningChip value='class'/>}
                {state.property ? <SuccessChip value='property'/>
                                : <WarningChip value='property'/>}
                {state.controlled_list ? <SuccessChip value='controlled_list'/>
                                       : <WarningChip value='controlled_list'/>}
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