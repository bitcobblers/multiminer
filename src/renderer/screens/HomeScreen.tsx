// UI.
import { Container, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Cached';
import NextIcon from '@mui/icons-material/FastForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMOre';

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
      header: 'Coins',
      component: <CoinsTable />,
    },
    {
      header: 'GPUs',
      component: <ComputeTable />,
    },
    {
      header: 'General',
      component: <MinerTable />,
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
      {dashboards.map((d) => (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h5">{d.header}</Typography>
          </AccordionSummary>
          <AccordionDetails>{d.component}</AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
