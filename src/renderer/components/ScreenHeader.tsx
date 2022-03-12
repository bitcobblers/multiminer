import { Divider, Typography } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ScreenHeader(props: any) {
  const { title } = props;

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ pt: '0.8rem' }}>
        {title}
      </Typography>
      <Divider />
    </>
  );
}
