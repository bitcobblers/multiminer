import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

type AutoScrollTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AutoScrollTextArea(props: AutoScrollTextAreaProps) {
  const { value } = props;
  const theme = useTheme();
  const textRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textRef.current !== null) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [value]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <textarea {...props} ref={textRef} style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.secondary, height: 'calc(100vh - 10rem)' }} />;
}

AutoScrollTextArea.propTypes = {
  value: PropTypes.string.isRequired,
};
