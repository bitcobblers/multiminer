import { useEffect, useState, useContext } from 'react';

// UI.
import { Container, Grid, Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Cached';
import NextIcon from '@mui/icons-material/FastForward';

// Services.
import { GpuStatistic, MinerStatistic, ConfiguredCoin, enabledCoins$, refreshData$ } from '../../models';
import { startMiner, stopMiner, nextCoin } from '../services/MinerManager';
import { UnmineableStats, unmineableWorkers$ } from '../services/UnmineableFeed';
import { gpuStatistics$, minerStatistics$ } from '../services/StatisticsAggregator';

import { MinerContext } from '../MinerContext';

// Screens.
import { ScreenHeader } from '../components';
import { CoinsTable, ComputeTable, MinerTable, WorkersGraphs } from '../components/dashboard';

export function HomeScreen(): JSX.Element {
  const [configuredCoins, setConfiguredCoins] = useState(Array<ConfiguredCoin>());
  const [currentGpuStats, setCurrentGpuStats] = useState(Array<GpuStatistic>());
  const [currentMinerStats, setCurrentMinerStats] = useState({} as MinerStatistic);
  const [workerStats, setWorkerStats] = useState<UnmineableStats>();
  const minerContext = useContext(MinerContext);

  useEffect(() => {
    const unmineableWorkersSubscription = unmineableWorkers$.subscribe((stats) => setWorkerStats(stats));
    const coinsSubscription = enabledCoins$.subscribe((coins) => setConfiguredCoins(coins));
    const gpuStatsSubscription = gpuStatistics$.subscribe((stats) => setCurrentGpuStats(stats));
    const minerStatsSubscription = minerStatistics$.subscribe((stats) => setCurrentMinerStats(stats));

    return () => {
      unmineableWorkersSubscription.unsubscribe();
      coinsSubscription.unsubscribe();
      gpuStatsSubscription.unsubscribe();
      minerStatsSubscription.unsubscribe();
    };
  }, [minerContext.currentCoin]);

  const minerActive = minerContext.state === 'active';

  return (
    <Container>
      <ScreenHeader title="Home">
        <Button startIcon={<PlayArrowIcon />} disabled={minerActive || !minerContext.profile} onClick={async () => startMiner()}>
          Start Miner
        </Button>
        <Button startIcon={<StopIcon />} disabled={!minerActive} onClick={async () => stopMiner()}>
          Stop Miner
        </Button>
        <Button startIcon={<NextIcon />} disabled={!minerActive || !minerContext.profile} onClick={async () => nextCoin()}>
          Next Coin
        </Button>
        <Button startIcon={<RefreshIcon />} onClick={() => refreshData$.next(Date.now())}>
          Refresh
        </Button>
      </ScreenHeader>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h5">GPUs</Typography>
          <ComputeTable gpus={currentGpuStats} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">General</Typography>
          <MinerTable miner={currentMinerStats} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Enabled Coins</Typography>
          <CoinsTable coins={configuredCoins} setCurrent={(symbol) => nextCoin(symbol)} stopCurrent={stopMiner} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Graphs</Typography>
          <WorkersGraphs workers={workerStats} />
        </Grid>
      </Grid>
    </Container>
  );
}
