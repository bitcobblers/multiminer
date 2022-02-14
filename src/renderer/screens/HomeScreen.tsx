import { useEffect, useState } from 'react';
import { Container, Divider, Typography, Button } from '@mui/material';
import { startMiner, stopMiner, nextCoin, serviceState } from '../services/MinerManager';
import { ticker } from '../services/CoinFeed';

export function HomeScreen(): JSX.Element {
  const [minerActive, setMinerActive] = useState(false);

  useEffect(() => {
    const subscription = serviceState.subscribe((s) => {
      setMinerActive(s === 'active');
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  useEffect(() => {
    const subscription = ticker.subscribe((coins) => {
      coins.forEach((c) => {
        // eslint-disable-next-line no-console
        console.log(`Symbol: ${c.symbol} - ${c.price}`);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>
      <Divider />
      <Button disabled={minerActive} onClick={async () => startMiner()}>
        Start Miner
      </Button>
      <Button disabled={!minerActive} onClick={async () => stopMiner()}>
        Stop Miner
      </Button>
      <Button disabled={!minerActive} onClick={async () => nextCoin()}>
        Next Coin
      </Button>
    </Container>
  );
}
