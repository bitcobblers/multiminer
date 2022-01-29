import React, { useLayoutEffect, useRef } from 'react';

type AutoScrollTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AutoScrollTextArea(props: AutoScrollTextAreaProps) {
  const { value } = props;
  const textRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textRef.current !== null) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [value]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <textarea {...props} ref={textRef} />;
}
