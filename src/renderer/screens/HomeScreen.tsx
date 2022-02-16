import { useEffect, useState } from 'react';
import { Container, Divider, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { startMiner, stopMiner, nextCoin, serviceState$ } from '../services/MinerManager';
import { ticker, updateTicker } from '../services/CoinFeed';
import { unmineable$, updateCoins } from '../services/UnmineableFeed';

export function HomeScreen(): JSX.Element {
  const [minerActive, setMinerActive] = useState(false);

  const refreshData = async () => {
    updateCoins();
    updateTicker();
  };

  useEffect(() => {
    const subscription = serviceState$.subscribe((s) => {
      setMinerActive(s.state === 'active');
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

  useEffect(() => {
    const subscription = unmineable$.subscribe((coins) => {
      coins.forEach((c) => {
        // eslint-disable-next-line no-console
        console.log(`Symbol: ${c.symbol}, Balance: ${c.balance}, Threshold: ${c.threshold}`);
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
      <RefreshIcon onClick={async () => refreshData()} />
    </Container>
  );
}
