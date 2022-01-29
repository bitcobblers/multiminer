import { useState, useEffect } from 'react';
import { Container, Typography, TextareaAutosize } from '@mui/material';
import { MinerService } from '../services/MinerService';

type MonitorScreenProps = {
  minerService: MinerService;
};

export function MonitorScreen(props: MonitorScreenProps): JSX.Element {
  const { minerService } = props;
  const [data, setData] = useState('');

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Monitor
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here you can monitor the raw output for the mining application that is currently running.
      </Typography>
      <TextareaAutosize readOnly aria-label="Miner Output" />
    </Container>
  );
}
