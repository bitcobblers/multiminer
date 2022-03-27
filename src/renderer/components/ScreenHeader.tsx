import { Divider, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export function ScreenHeader(props: PropsWithChildren<{ title: string }>) {
  const { title, children } = props;
  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ pt: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>{title}</span> <div>{children}</div>
      </Typography>
      <Divider />
    </>
  );
}
