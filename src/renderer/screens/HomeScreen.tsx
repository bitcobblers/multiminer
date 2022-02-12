import { Container, Divider, Typography, Button } from '@mui/material';
import { startMiner, stopMiner, nextCoin } from '../services/MinerManager';

export function HomeScreen(): JSX.Element {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>
      <Divider />
      <Button onClick={async () => startMiner()}>Start Miner</Button>
      <Button onClick={async () => stopMiner()}>Stop Miner</Button>
      <Button onClick={async () => nextCoin()}>Next Coin</Button>
    </Container>
  );
}
