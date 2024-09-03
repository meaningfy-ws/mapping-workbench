import React from 'react';

/**
 * Converts new line characters to <br /> tags for rendering in React
 * @param {string} text - The text to convert
 * @return {JSX.Element[]} - Array of React elements
 */
const nl2br = (text) => {
    return text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));
};

export default nl2br;