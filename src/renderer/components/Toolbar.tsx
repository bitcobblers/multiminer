import NextIcon from '@mui/icons-material/FastForward';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip, Typography, useTheme } from '@mui/material';
import { Miner, MinerState, minerState$, MinerStatistic } from 'models';
import { useContext, useEffect, useState } from 'react';
import { MinerContext } from 'renderer/MinerContext';
import { getAppSettings, getMiners, setAppSettings } from 'renderer/services/AppSettingsService';
import * as formatter from 'renderer/services/Formatters';
import { nextCoin, startMiner, stopMiner } from 'renderer/services/MinerManager';
import { minerStatistics$ } from 'renderer/services/StatisticsAggregator';

function Separator() {
  const theme = useTheme();
  return <span style={{ fontSize: '1.4rem', fontWeight: 'lighter', color: theme.palette.text.disabled, margin: '0 0.2rem' }}>|</span>;
}

export function Toolbar({ drawerWidth }: { drawerWidth: number }) {
  const minerContext = useContext(MinerContext);
  const theme = useTheme();

  const [minerState, setMinerState] = useState<MinerState>();
  const minerActive = minerState?.state === 'active';

  const [minerStatistic, setMinerStatistic] = useState<MinerStatistic>();

  useEffect(() => {
    const minerSubscription = minerState$.subscribe((s) => setMinerState(s));
    const statsSubscription = minerStatistics$.subscribe((s) => setMinerStatistic(s));
    return () => {
      minerSubscription.unsubscribe();
      statsSubscription.unsubscribe();
    };
  }, []);

  const [miners, setLoadedMiners] = useState(Array<Miner>());

  useEffect(() => {
    getMiners()
      .then(setLoadedMiners)
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Failed to load miners: ', err));
  }, []);

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
        justifyContent: minerActive ? 'space-between' : 'flex-end',
        height: '3.5rem',
        position: 'fixed',
        bottom: 0,
        ml: `${drawerWidth}px`,
        px: 2,
        backgroundColor: theme.palette.background.paper,
        borderTop: `2px solid ${theme.palette.divider}`,
      }}
    >
      <FormControl size="small" sx={{ minWidth: '12rem' }}>
        <InputLabel id="miner-label">Miner</InputLabel>
        <Select labelId="miner-label" sx={{ fontSize: '0.8rem' }} label="Miner" value={minerContext.profile ?? ''} onChange={($event) => setDefaultMiner($event.target.value)}>
          {miners.map((miner) => (
            <MenuItem key={miner.name} value={miner.name}>
              {miner.name} ({miner.kind})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {minerActive && (
        <Typography sx={{ mr: 2 }}>
          <strong>Coin</strong>: {minerState?.currentCoin} <Separator /> <strong>Hashrate</strong>: {formatter.hashrate(minerStatistic?.hashrate)}{' '}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Tooltip title={minerActive ? 'Stop Miner' : 'Start Miner'}>
          <IconButton onClick={() => (minerActive ? stopMiner() : startMiner())}>{minerActive ? <Stop color="error" /> : <PlayArrow color="primary" />}</IconButton>
        </Tooltip>
        <Separator />
        <Tooltip title="Next Coin">
          <span>
            <IconButton disabled={!minerActive || minerContext.miner === null} onClick={() => nextCoin()}>
              <NextIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}
