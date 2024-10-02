import CodeMirror from "@uiw/react-codemirror";
import {githubDark, githubLight} from "@uiw/codemirror-themes-all";
import {yaml} from '@codemirror/lang-yaml'
import {xml} from '@codemirror/lang-xml'
import {json} from '@codemirror/lang-json'
// import rdf from '@rdfjs-elements/rdf-editor'
import {turtle} from 'codemirror-lang-turtle';
import {sparql} from 'codemirror-lang-sparql';


import {useTheme} from "@mui/material/styles";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import {Box} from "@mui/system";


const languageSwitch = (lang) => {
    switch (lang) {
        case 'YAML':
            return yaml
        case 'XML' :
            return xml
        case 'JSON':
            return json
        case 'TTL':
        case 'SHACL.TTL':
            return turtle
        case 'RQ':
            return sparql
        default:
            return json
    }
}

const CodeMirrorDefault = ({value, onChange, lang, label, disabled, style}) => {
    const theme = useTheme();

    return (
        <FormControl fullWidth>
            <FormLabel
                sx={{
                    color: 'text.primary',
                    mb: 1,
                }}
                htmlFor={name}
            >
                {label}
            </FormLabel>
            <Box>
                <CodeMirror
                    theme={theme.palette.mode === 'dark' ? githubDark : githubLight}
                    style={style}
                    enabled={!disabled}
                    value={value}
                    extensions={[languageSwitch(lang)()]}
                    onChange={onChange}/>
            </Box>
        </FormControl>
    )
}

export default CodeMirrorDefault