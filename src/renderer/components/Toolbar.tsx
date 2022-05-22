import { Box, Stack, useTheme } from '@mui/material';
import { MinerSummary, MinerSelector, MinerControls } from './toolbars';

export function Toolbar({ drawerWidth }: { drawerWidth: number }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: `calc(100vw - ${drawerWidth}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '3.5rem',
        position: 'fixed',
        bottom: 0,
        ml: `${drawerWidth}px`,
        px: 2,
        backgroundColor: theme.palette.background.paper,
        borderTop: `2px solid ${theme.palette.divider}`,
      }}
    >
      <MinerSummary />
      <Stack direction="row" gap={1} alignItems="center">
        <MinerSelector />
        <MinerControls />
      </Stack>
    </Box>
  );
}
