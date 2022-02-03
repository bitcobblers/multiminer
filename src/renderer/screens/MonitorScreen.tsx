import { useState, useEffect } from 'react';
import { Container, Typography, Divider, Button, Box } from '@mui/material';
import { MinerService } from '../services/MinerService';
import { AutoScrollTextArea } from '../components/AutoScrollTextArea';

type MonitorScreenProps = {
  minerService: MinerService;
};

export function MonitorScreen(props: MonitorScreenProps): JSX.Element {
  const { minerService } = props;
  const [data, setData] = useState(minerService.buffer.content);

  useEffect(() => {
    const dataReceived = (content: string) => {
      setData(content);
    };

    minerService.onReceive(dataReceived);

    return () => {
      minerService.offReceive(dataReceived);
    };
  });

  const clearLog = () => {
    minerService.buffer.clear();
    setData('');
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Monitor
      </Typography>
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
