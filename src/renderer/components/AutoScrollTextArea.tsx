import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

type AutoScrollTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isPaused?: boolean;
};

export function AutoScrollTextArea(props: AutoScrollTextAreaProps) {
  const { isPaused, ...domProps } = props;
  const theme = useTheme();
  const textRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (!isPaused && textRef.current !== null) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }

    // eslint-disable-next-line react/destructuring-assignment
  }, [isPaused, props.value]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <textarea {...domProps} ref={textRef} style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.secondary, height: 'calc(100vh - 14.5rem)', resize: 'none' }} />;
}

AutoScrollTextArea.propTypes = {
  value: PropTypes.string.isRequired,
  isPaused: PropTypes.bool.isRequired,
};
