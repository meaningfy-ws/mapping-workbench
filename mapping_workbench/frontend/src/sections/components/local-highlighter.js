import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';

export const LocalHighlighter = ({text, ...other}) => {
    return text && <SyntaxHighlighter
        wrapLines
        customStyle={{borderRadius: 12, border: '1px solid #E4E7EC'}}
        lineProps={{style: {overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}}
        {...other}>
        {text}
    </SyntaxHighlighter>
}