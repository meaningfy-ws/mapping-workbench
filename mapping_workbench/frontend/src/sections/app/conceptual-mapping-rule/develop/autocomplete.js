import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const Autocomplete = () => {
    const [state, setState] = useState({})
    return (
        <MuiAutocomplete
      id="highlights-demo"
      sx={{ width: 300 }}
      options={data.class}
      // getOptionLabel={(option) => option.title}
      renderInput={(params) => (
        <TextField
            {...params}
            label="Highlights"
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
        "controled list": [
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