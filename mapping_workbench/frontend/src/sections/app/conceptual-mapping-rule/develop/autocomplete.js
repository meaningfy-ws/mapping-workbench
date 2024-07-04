import {useState} from "react";

import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";

const Autocomplete = () => {
    const [state, setState] = useState({})

    const handleSelect = (value) => {
        if(!state.class) {
            setState(e => ({class: value}))
            return
        }
        if(!state.property) {
            setState(e => ({class: e.class, property: value}))
            return
        }
        if(!state.controled_list)
            setState(e=>({...e, controled_list: value}))
    }


    console.log(state)

    const currentValue =
        !state.class
            ? state.class
            : !state.property
                ? state.property
                : state.controled_list

    const currentLabel =
        !state.class
            ? 'class'
            : !state.property
                ? 'property'
                : 'controled_list'

    const currentOptions =
        !state.class
            ? data.class
            : !state.property
                ? data.property
                : data.controled_list


    const handleChipDelete = (value) => {
        if(value === 'class')
            setState({})
        if(value === 'property')
            setState(e=>({class:e.class}))
        if(value === 'controled_list')
            setState(e=> ({class:e.class, property:e.property}))
    }

    return (
        <Stack>
            <MuiAutocomplete
                  id="autocomplete"
                  options={currentOptions}
                  fullWidth
                  onChange={(e,value)=> handleSelect(value)}
                  value={currentValue}
                  disabled={state.controled_list}
                  // getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField
                        {...params}
                        label={currentLabel}
                        margin="normal" />
                  )}
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
            <Breadcrumbs separator={"/"} >
                {state.class ? <Chip label={state.class}
                                       color='success'
                                       onDelete={() => handleChipDelete('class')}/>
                                : <Chip label='Class'
                                        color='warning'/>}
                {state.property ? <Chip label={state.property}
                                          color='success'
                                          onDelete={() => handleChipDelete('property')}/>
                                  : <Chip label='Property'
                                          color={currentLabel==='property' ? 'warning' : 'default'}/>}
                {state.controled_list ? <Chip label={state.controled_list}
                                                color='success'
                                                onDelete={() => handleChipDelete('controled_list')}/>
                                        : <Chip label='Controled List'
                                                color={currentLabel==='controled_list' ? 'warning' : 'default'}/>}
            </Breadcrumbs>
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
        "controled_list": [
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