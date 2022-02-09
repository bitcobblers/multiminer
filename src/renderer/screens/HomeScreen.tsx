import { Container, Divider, Typography, Button } from '@mui/material';
import { startMiner, stopMiner } from '../services/MinerService';

export function HomeScreen(): JSX.Element {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>
      <Divider />
      <Button onClick={async () => startMiner('C:\\ethereum\\xmrig-6.16.2\\xmrig.exe', '')}>Start Miner</Button>
      <Button onClick={async () => stopMiner()}>Stop Miner</Button>
    </Container>
  );
}
