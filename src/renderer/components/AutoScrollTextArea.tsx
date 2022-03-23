import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

type AutoScrollTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isPaused?: boolean;
};

export function AutoScrollTextArea(props: AutoScrollTextAreaProps) {
  const { value, isPaused } = props;
  const theme = useTheme();
  const textRef = useRef<HTMLTextAreaElement>(null);

  const domProps = { ...props };
  delete domProps.isPaused;

  useLayoutEffect(() => {
    if (!isPaused) {
      if (textRef.current !== null) {
        textRef.current.scrollTop = textRef.current.scrollHeight;
      }
    }
  }, [isPaused, value]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <textarea {...domProps} ref={textRef} style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.secondary, height: 'calc(100vh - 10rem)' }} />;
}

AutoScrollTextArea.propTypes = {
  value: PropTypes.string.isRequired,
  isPaused: PropTypes.bool.isRequired,
};
