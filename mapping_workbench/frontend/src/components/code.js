import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {useHighlighterTheme} from "../hooks/use-highlighter-theme";

export const Code = (props) => {
  const { children, className, inline, ...other } = props;
  const syntaxHighlighterTheme = useHighlighterTheme()
  const language = /language-(\w+)/.exec(className || '');

  return !inline && language
    ? (
      <SyntaxHighlighter
        language={language[1]}
        PreTag="div"
        style={syntaxHighlighterTheme}
        {...other}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    )
    : (
      <code
        className={className}
        {...other}>
        {children}
      </code>
    );
};

Code.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  inline: PropTypes.bool
};
