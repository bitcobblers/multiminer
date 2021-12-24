import { Divider, Typography } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ScreenHeader(props: any) {
  const { title } = props;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Divider />
    </div>
  );
}
