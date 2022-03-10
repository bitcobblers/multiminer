import { useEffect, useState, useContext } from 'react';

// UI.
import { Container, Divider, Grid, Button, Typography } from '@mui/material';

// Services.
import { GpuStatistic, MinerStatistic, ConfiguredCoin, minerState$, gpuStatistics$, minerStatistics$ } from '../../models';
import { startMiner, stopMiner, nextCoin } from '../services/MinerManager';
import { updateTicker } from '../services/CoinFeed';
import { UnmineableStats, unmineableWorkers$, updateCoins } from '../services/UnmineableFeed';

import { enabledCoins$ } from '../services/DataService';
import { MinerContext } from '../MinerContext';

// Screens.
import { ScreenHeader } from '../components';
import { CoinsTable, ComputeTable, MinerTable, WorkersGraphs } from '../components/dashboard';

export function HomeScreen(): JSX.Element {
  const [minerActive, setMinerActive] = useState(false);
  const [configuredCoins, setConfiguredCoins] = useState(Array<ConfiguredCoin>());
  const [currentGpuStats, setCurrentGpuStats] = useState(Array<GpuStatistic>());
  const [currentMinerStats, setCurrentMinerStats] = useState({} as MinerStatistic);
  const [workerStats, setWorkerStats] = useState<UnmineableStats>();
  const minerContext = useContext(MinerContext);

  const refreshData = async () => {
    await Promise.allSettled([updateCoins(), updateTicker()]);
  };

  useEffect(() => {
    const minerSubscription = minerState$.subscribe((s) => setMinerActive(s.state === 'active'));
    const unmineableWorkersSubscription = unmineableWorkers$.subscribe((stats) => setWorkerStats(stats));
    const coinsSubscription = enabledCoins$.subscribe((coins) => setConfiguredCoins(coins));
    const gpuStatsSubscription = gpuStatistics$.subscribe((stats) => setCurrentGpuStats(stats));
    const minerStatsSubscription = minerStatistics$.subscribe((stats) => setCurrentMinerStats(stats));

    return () => {
      minerSubscription.unsubscribe();
      unmineableWorkersSubscription.unsubscribe();
      coinsSubscription.unsubscribe();
      gpuStatsSubscription.unsubscribe();
      minerStatsSubscription.unsubscribe();
    };
  }, [minerContext.currentCoin]);

  return (
    <Container>
      <ScreenHeader title="Home" />
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
      <Button onClick={async () => refreshData()}>Refresh</Button>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Devices</Typography>
          <ComputeTable gpus={currentGpuStats} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">Miner</Typography>
          <MinerTable miner={currentMinerStats} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">Coins</Typography>
          <CoinsTable coins={configuredCoins} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">Graphs</Typography>
          <WorkersGraphs workers={workerStats} />
        </Grid>
      </Grid>
    </Container>
  );
}
