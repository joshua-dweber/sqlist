import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/okaidia";

const Basic = ({code}) => (
  <Highlight {...defaultProps} theme={theme} code={code} language="sql">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre>
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);

export default Basic;
