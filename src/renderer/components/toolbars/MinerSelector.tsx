import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { Miner } from '../../../models';
import { useLoadData, useObservableState, useProfile } from '../../hooks';
import { getAppSettings, setAppSettings, watchers$ } from '../../services/AppSettingsService';

export function MinerSelector() {
  const [miners, setLoadedMiners] = useObservableState(watchers$.miners, []);

  useLoadData(async ({ getMiners }) => {
    getMiners()
      .then(setLoadedMiners)
      .catch((err) => console.error('Failed to load miners: ', err));
  });

  const profile = useProfile();

  const setDefaultMiner = async (name: string) => {
    const appSettings = await getAppSettings();
    await setAppSettings({ ...appSettings, settings: { ...appSettings.settings, defaultMiner: name } });
  };

  return (
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
  );
}
