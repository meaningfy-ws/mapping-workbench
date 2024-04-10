import {useEffect, useState} from "react";
import Editor from 'react-simple-code-editor';
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-turtle';
import 'prismjs/components/prism-sparql';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-csv';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/show-language/prism-show-language';
import 'prismjs/themes/prism-dark.css';
import FormControl from "@mui/material/FormControl";
import {Box} from '@mui/system';
import styles from './style/code-text-area.module.scss';
import variables from './style/variables.code-text-area.module.scss';

const DEFAULT_GRAMMAR = 'text';
const DEFAULT_LANGUAGE = 'html';

export const FormCodeReadOnlyArea = (props) => {
    const {
        defaultContent = '', name, label,
        grammar = 'html', language = null,
        ...other
    } = props;


    const [content, setContent] = useState(defaultContent);

    useEffect(()=>{
        defaultContent && setContent(defaultContent)
    },[defaultContent])

    const handleContentChange = (text) => setContent(text)

    const codeGrammar = grammar ? languages[grammar] : DEFAULT_GRAMMAR;
    const codeLanguage = language || DEFAULT_LANGUAGE;

    return (
        <div className={styles['form-control-code-textarea']}>
            <FormControl fullWidth>
                <Box
                    sx={{
                        height: eval(variables['codeTextareaHeight']),
                        overflow: 'auto',
                        borderRadius: 1,
                        borderColor: 'divider',
                        borderStyle: 'solid'
                    }}
                >
                    <div className="line-numbers code-toolbar">
                        <Editor
                            value={content}
                            onValueChange={content => handleContentChange(content)}
                            highlight={content => highlight(content, codeGrammar, codeLanguage)}
                            padding={10}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 14,
                                width: '100%',
                                outline: 'none',
                                border: 0,
                                boxShadow: 'none',
                            }}
                            textareaClassName={styles['code-textarea']}
                            preClassName={styles['code-textarea-pre']}
                            textareaId={name}
                            label={label}
                            name={name}
                            {...other}
                        />
                    </div>
                </Box>
            </FormControl>
        </div>
    )
}
