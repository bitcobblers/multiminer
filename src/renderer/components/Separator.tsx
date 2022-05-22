import { useTheme } from '@mui/material';

export function Separator() {
  const theme = useTheme();
  return <span style={{ fontSize: '1.4rem', fontWeight: 'lighter', color: theme.palette.text.disabled, margin: '0 0.2rem' }}>|</span>;
}
