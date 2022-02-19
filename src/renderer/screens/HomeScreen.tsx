import { useEffect, useState, useContext } from 'react';
import { Container, Divider, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { startMiner, stopMiner, nextCoin, serviceState$ } from '../services/MinerManager';
import { ticker, updateTicker } from '../services/CoinFeed';
import { unmineable$, updateCoins } from '../services/UnmineableFeed';
import { MinerContext } from '../MinerContext';

export function HomeScreen(): JSX.Element {
  const [minerActive, setMinerActive] = useState(false);
  const minerContext = useContext(MinerContext);

  const refreshData = async () => {
    await Promise.allSettled([updateCoins(), updateTicker()]);
  };

  useEffect(() => {
    const minerSubscription = serviceState$.subscribe((s) => {
      setMinerActive(s.state === 'active');
    });

    const tickerSubscription = ticker.subscribe((coins) => {
      coins.forEach((c) => {
        // eslint-disable-next-line no-console
        console.log(`Symbol: ${c.symbol} - ${c.price}`);
      });
    });

    const unmineableSubscription = unmineable$.subscribe((coins) => {
      coins.forEach((c) => {
        // eslint-disable-next-line no-console
        console.log(`Symbol: ${c.symbol}, Balance: ${c.balance}, Threshold: ${c.threshold}`);
      });
    });

    return () => {
      minerSubscription.unsubscribe();
      tickerSubscription.unsubscribe();
      unmineableSubscription.unsubscribe();
    };
  });

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>
      <Divider />
      <Button disabled={minerActive || minerContext.miner === null} onClick={async () => startMiner()}>
        Start Miner
      </Button>
      <Button disabled={!minerActive} onClick={async () => stopMiner()}>
        Stop Miner
      </Button>
      <Button disabled={!minerActive || minerContext.miner === null} onClick={async () => nextCoin()}>
        Next Coin
      </Button>
      <RefreshIcon onClick={async () => refreshData()} />
    </Container>
  );
}
