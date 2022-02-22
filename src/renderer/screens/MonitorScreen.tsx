import { useState, useEffect } from 'react';
import { Container, Typography, Divider, Button, Box } from '@mui/material';
import { screenBuffer, clearBuffer } from '../services/ScreenBuffer';
import { AutoScrollTextArea } from '../components/AutoScrollTextArea';
import { ScreenHeader } from '../components/ScreenHeader';

export function MonitorScreen(): JSX.Element {
  const [data, setData] = useState(screenBuffer.value);

  useEffect(() => {
    const dataReceived = (content: string) => {
      setData(content);
    };

    const subscription = screenBuffer.subscribe(dataReceived);

    return () => {
      subscription.unsubscribe();
    };
  });

  const clearLog = () => {
    clearBuffer();
  };

  return (
    <Container>
      <ScreenHeader title="Monitor" />
      <Typography variant="body1" gutterBottom>
        Here you can monitor the raw output for the mining application that is currently running.
      </Typography>
      <Divider />
      <Button onClick={clearLog}>Clear Log</Button>
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
        }}
      >
        <AutoScrollTextArea value={data} rows={15} readOnly min-width="99%" />
      </Box>
    </Container>
  );
}
