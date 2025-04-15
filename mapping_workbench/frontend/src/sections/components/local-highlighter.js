import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

export const LocalHighlighter = ({text, ...other}) => {
    return text && <SyntaxHighlighter
        wrapLines
        customStyle={{borderRadius: 12, border: '1px solid #E4E7EC', width: '100%'}}
        lineProps={{
            style: {
                width: '100%',
                whiteSpace: 'pre-wrap', // allows long lines to wrap
                wordBreak: 'break-word' // for long tokens like URLs
            }
        }}
        {...other}>
        {text}
    </SyntaxHighlighter>
}