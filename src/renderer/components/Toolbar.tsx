// Icons
import NextIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

// Material UI.
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { Miner, minerState$ } from 'models';

// React.
import { useContext, useEffect } from 'react';

// Hooks.
import { MinerContext } from 'renderer/MinerContext';

// Services.
import { getAppSettings, getMiners, setAppSettings, watchers$ } from 'renderer/services/AppSettingsService';
import * as formatter from 'renderer/services/Formatters';
import { nextCoin, startMiner, stopMiner } from 'renderer/services/MinerManager';
import { minerStatistics$ } from 'renderer/services/StatisticsAggregator';

// Hooks.
import { useProfile, useObservableState } from '../hooks';

function Separator() {
  const theme = useTheme();
  return <span style={{ fontSize: '1.4rem', fontWeight: 'lighter', color: theme.palette.text.disabled, margin: '0 0.2rem' }}>|</span>;
}

export function Toolbar({ drawerWidth }: { drawerWidth: number }) {
  const minerContext = useContext(MinerContext);
  const theme = useTheme();
  const profile = useProfile();

  const [minerState] = useObservableState(minerState$, null);
  const [minerStatistic] = useObservableState(minerStatistics$, null);
  const [miners, setLoadedMiners] = useObservableState(watchers$.miners, []);

  const minerActive = minerState?.state === 'active';

  useEffect(() => {
    getMiners()
      .then(setLoadedMiners)
      .catch((err) => console.error('Failed to load miners: ', err));
  }, [setLoadedMiners]);

  const setDefaultMiner = async (name: string) => {
    const appSettings = await getAppSettings();
    await setAppSettings({ ...appSettings, settings: { ...appSettings.settings, defaultMiner: name } });
  };

  return (
    <Box
      sx={{
        width: `calc(100vw - ${drawerWidth}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '3.5rem',
        position: 'fixed',
        bottom: 0,
        ml: `${drawerWidth}px`,
        px: 2,
        backgroundColor: theme.palette.background.paper,
        borderTop: `2px solid ${theme.palette.divider}`,
      }}
    >
      <Box>
        {minerActive && (
          <Typography sx={{ mr: 2 }}>
            <strong>Coin</strong>: {minerState?.currentCoin} <Separator /> <strong>Hashrate</strong>: {formatter.hashrate(minerStatistic?.hashrate)}{' '}
          </Typography>
        )}
      </Box>
      <Stack direction="row" gap={1} alignItems="center">
        <FormControl size="small" sx={{ minWidth: '12rem' }}>
          <InputLabel id="miner-label">Miner</InputLabel>
          <Select labelId="miner-label" sx={{ fontSize: '0.8rem' }} label="Miner" value={profile ?? ''} onChange={($event) => setDefaultMiner($event.target.value)}>
            {(miners ?? Array<Miner>())
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((miner) => (
                <MenuItem key={miner.name} value={miner.name}>
                  {miner.name} ({miner.kind})
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Stack justifyContent="space-around" alignItems="center" direction="row">
          <Tooltip title={minerActive ? 'Stop Miner' : 'Start Miner'}>
            <IconButton onClick={() => (minerActive ? stopMiner() : startMiner())}>{minerActive ? <StopIcon color="error" /> : <PlayArrowIcon color="primary" />}</IconButton>
          </Tooltip>
          <Separator />
          <Tooltip title="Next Coin">
            <span>
              <IconButton disabled={!minerActive || minerContext.miner === null} onClick={() => nextCoin()}>
                <NextIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}
