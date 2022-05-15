import { Stack, IconButton, Tooltip } from '@mui/material';

// Icons
import NextIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

import { useProfile, useMinerActive } from '../../hooks';
import { stopMiner, startMiner, nextCoin } from '../../services/MinerManager';
import { Separator } from '..';

export function MinerControls() {
  const profile = useProfile();
  const minerActive = useMinerActive();

  return (
    <Stack justifyContent="space-around" alignItems="center" direction="row">
      <Tooltip title={minerActive ? 'Stop Miner' : 'Start Miner'}>
        <IconButton onClick={() => (minerActive ? stopMiner() : startMiner())}>{minerActive ? <StopIcon color="error" /> : <PlayArrowIcon color="primary" />}</IconButton>
      </Tooltip>
      <Separator />
      <Tooltip title="Next Coin">
        <span>
          <IconButton disabled={!minerActive || !profile} onClick={() => nextCoin()}>
            <NextIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
