// UI.
import { Container, Grid, Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Cached';
import NextIcon from '@mui/icons-material/FastForward';

// Services.
import { refreshData$, minerState$ } from '../../models';
import { startMiner, stopMiner, nextCoin } from '../services/MinerManager';

// Hooks.
import { useProfile, useObservableState } from '../hooks';

// Screens.
import { ScreenHeader } from '../components';
import { CoinsTable, ComputeTable, MinerTable, WorkersGraphs } from '../components/dashboard';

export function HomeScreen(): JSX.Element {
  const [minerState] = useObservableState(minerState$, null);

  const profile = useProfile();
  const minerActive = minerState?.state === 'active';

  const dashboards = [
    {
      header: 'GPUs',
      component: <ComputeTable />,
    },
    {
      header: 'General',
      component: <MinerTable />,
    },
    {
      header: 'Enabled Coins',
      component: <CoinsTable />,
    },
    {
      header: 'Graphs',
      component: <WorkersGraphs />,
    },
  ];

  return (
    <Container>
      <ScreenHeader title="Home">
        <Button startIcon={<PlayArrowIcon />} disabled={minerActive || !profile} onClick={async () => startMiner()}>
          Start Miner
        </Button>
        <Button startIcon={<StopIcon />} disabled={!minerActive} onClick={async () => stopMiner()}>
          Stop Miner
        </Button>
        <Button startIcon={<NextIcon />} disabled={!minerActive || !profile} onClick={async () => nextCoin()}>
          Next Coin
        </Button>
        <Button startIcon={<RefreshIcon />} onClick={() => refreshData$.next(Date.now())}>
          Refresh
        </Button>
      </ScreenHeader>
      <Grid container spacing={4}>
        {dashboards.map((d) => (
          <Grid item xs={12}>
            <Typography variant="h5">{d.header}</Typography>
            {d.component}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
