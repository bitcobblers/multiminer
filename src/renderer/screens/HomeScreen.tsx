import { useEffect, useState, useContext } from 'react';

// UI.
import { Container, Divider, Grid, Button, Typography, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Cached';
import NextIcon from '@mui/icons-material/NavigateNext';

// Services.
import { GpuStatistic, MinerStatistic, ConfiguredCoin, minerState$, enabledCoins$, refreshData$ } from '../../models';
import { startMiner, stopMiner, nextCoin } from '../services/MinerManager';
import { UnmineableStats, unmineableWorkers$ } from '../services/UnmineableFeed';
import { gpuStatistics$, minerStatistics$ } from '../services/MinerEventStreamer';

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
      <Box sx={{ my: '0.6rem', display: 'flex', justifyContent: 'space-between', maxWidth: '50%', '& .MuiButton-root': { minWidth: '8.8rem' } }}>
        <Button disabled={minerActive || minerContext.miner === null} onClick={async () => startMiner()}>
          <PlayArrowIcon /> Start Miner
        </Button>
        <Button disabled={!minerActive} onClick={async () => stopMiner()}>
          <StopIcon />
          Stop Miner
        </Button>
        <Button disabled={!minerActive || minerContext.miner === null} onClick={async () => nextCoin()}>
          <NextIcon />
          Next Coin
        </Button>
        <Button onClick={() => refreshData$.next(Date.now())}>
          <RefreshIcon sx={{ pr: '0.2rem' }} />
          Refresh
        </Button>
      </Box>
      <Grid container spacing={4}>
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
