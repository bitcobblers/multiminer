import { useState } from 'react';
import { Container, Typography, Divider, Button, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import { screenBuffer, clearBuffer } from '../services/ScreenBuffer';
import { AutoScrollTextArea, ScreenHeader } from '../components';
import { useObservable } from '../hooks';

export function MonitorScreen(): JSX.Element {
  const [data, setData] = useState(screenBuffer.value);
  const [isPaused, setIsPaused] = useState(false);

  useObservable(screenBuffer, setData);

  const clearLog = () => {
    clearBuffer();
  };

  return (
    <Container>
      <ScreenHeader title="Monitor">
        <Button startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />} onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button startIcon={<DeleteIcon />} onClick={clearLog}>
          Clear Log
        </Button>
      </ScreenHeader>
      <Typography variant="body1" gutterBottom>
        Here you can monitor the raw output for the mining application that is currently running.
      </Typography>
      <Divider />
      <Box
        sx={{
          '& .MuiDataGrid-cell--editing': {
            bgcolor: 'rgb(255,215,115, 0.19)',
            color: '#1a3e72',
          },
          '& .Mui-error': {
            bgcolor: (theme) => `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
            color: (theme) => (theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f'),
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'stretch',
          alignContent: 'stretch',
        }}
      >
        <AutoScrollTextArea value={data} readOnly min-width="99%" isPaused={isPaused} />
      </Box>
    </Container>
  );
}
