import NextIcon from '@mui/icons-material/NavigateNext';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { minerState$ } from 'models';
import { useContext, useEffect, useState } from 'react';
import { MinerContext } from 'renderer/MinerContext';
import { nextCoin, startMiner, stopMiner } from 'renderer/services/MinerManager';

function Separator() {
  const theme = useTheme();
  return <span style={{ fontSize: '1.4rem', fontWeight: 'lighter', color: theme.palette.text.disabled }}>|</span>;
}

export function Toolbar() {
  const minerContext = useContext(MinerContext);
  const [minerActive, setMinerActive] = useState(false);

  useEffect(() => {
    const minerSubscription = minerState$.subscribe((s) => setMinerActive(s.state === 'active'));
    return () => {
      minerSubscription.unsubscribe();
    };
  }, [minerContext.currentCoin]);

  return (
    <Box sx={{ mx: '1rem' }}>
      {/* TODO: add default miner selection (https://github.com/bitcobblers/multiminer/issues/33) */}
      {/* <FormControl fullWidth size="small" sx={{ mb: '0.5rem' }}>
        <InputLabel id="miner-label">Miner</InputLabel>
        <Select labelId="miner-label" label="Miner"></Select>
      </FormControl> */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Tooltip title={minerActive ? 'Stop Miner' : 'Start Miner'}>
          <IconButton onClick={() => (minerActive ? stopMiner() : startMiner())}>{minerActive ? <Stop /> : <PlayArrow />}</IconButton>
        </Tooltip>
        <Separator />
        <Tooltip title="Next Coin">
          <IconButton disabled={!minerActive || minerContext.miner === null} onClick={async () => nextCoin()}>
            <NextIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
