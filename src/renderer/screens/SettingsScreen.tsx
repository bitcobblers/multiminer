import { useEffect, useState } from 'react';
import { Button, Stack, TextField, Container, Typography, Divider, FormControl } from '@mui/material';

import { ScreenHeader } from '../components/ScreenHeader';
import { ConfigurableControl } from '../components/ConfigurableControl';
import { AppSettingsService, defaults } from '../services/AppSettingsService';

interface SettingsScreenProps {
  appSettingsService: AppSettingsService;
}

export function SettingsScreen(props: SettingsScreenProps) {
  const { appSettingsService } = props;
  const [settings, setSettings] = useState(defaults.settings.settings);
  const [pools, setPools] = useState(defaults.settings.pools);

  useEffect(() => {
    appSettingsService
      .getAppSettings()
      .then((s) => {
        setSettings(s.settings);
        setPools(s.pools);
        return s;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(`Unable to load settings: ${error}`);
      });
  }, [appSettingsService]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWorkerNameChange = (e: any) => {
    // updateSettings({ workerName: e.target.value.trim() });
    setSettings({ ...settings, ...{ workerName: e.target.value.trim() } });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateIntervalChange = (e: any) => {
    setSettings({ ...settings, ...{ updateInterval: e.target.value.trim() } });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCooldownIntervalChange = (e: any) => {
    const value = e.target.value.trim();
    setSettings({ ...settings, ...{ cooldownInterval: value.length === 0 ? 0 : value } });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEthashUrlChanged = (e: any) => {
    setPools({ ...pools, ...{ ethash: e.target.value.trim() } });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEtchashUrlChanged = (e: any) => {
    setPools({ ...pools, ...{ etchash: e.target.value.trim() } });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKawpawUrlChanged = (e: any) => {
    setPools({ ...pools, ...{ kawpaw: e.target.value.trim() } });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRandomXUrlChanged = (e: any) => {
    setPools({ ...pools, ...{ randomx: e.target.value.trim() } });
  };

  const validateWorkerName = (workerName: string): [boolean, string] => {
    const workerFormat = /^[a0zA-Z0-9\-_]+/;
    const maxLength = 30;

    if (workerName.length === 0) {
      return [true, 'A worker name must be provided.'];
    }

    if (workerName.length > maxLength) {
      return [true, 'A worker name cannot be more than 30 characters long.'];
    }

    if (workerName.match(workerFormat) !== null) {
      return [true, "The worker name must only contain letters numbers, or a '-' and '_' symbol."];
    }

    return [false, ''];
  };

  const validateUpdateInterval = (interval: number): [boolean, string] => {
    const intervalAsString = interval.toString();

    if (intervalAsString.length === 0) {
      return [true, 'The interval must be specified.'];
    }

    if (interval < 5) {
      return [true, 'The interval cannot be less than 5 minutes.'];
    }

    return [false, ''];
  };

  const validatePoolUrl = (url: string): [boolean, string] => {
    if (url.length === 0) {
      return [true, 'A pool url must be specified.'];
    }

    return [false, ''];
  };

  const onSave = async () => {
    await appSettingsService.setAppSettings({
      settings,
      pools,
    });
  };

  const [isWorkerNameInvalid, workerNameValidationMessage] = validateWorkerName(settings.workerName);
  const [isUpdateIntervalInvalid, updateIntervalValidationMessage] = validateUpdateInterval(settings.updateInterval);
  const [isEthashUrlInvalid, ethashValidationMessage] = validatePoolUrl(pools.ethash);
  const [isEtchashUrlInvalid, etchashValidationMessage] = validatePoolUrl(pools.etchash);
  const [isKawpawUrlInvalid, kawpawValidationMessage] = validatePoolUrl(pools.kawpaw);
  const [isRandomxUrlInvalid, randomxValidationMessage] = validatePoolUrl(pools.randomx);
  const isFormInvalid = isWorkerNameInvalid || isUpdateIntervalInvalid || isEthashUrlInvalid || isEtchashUrlInvalid || isKawpawUrlInvalid || isRandomxUrlInvalid;
  const DefaultSpacing = 2;

  return (
    <Container>
      <ScreenHeader title="Settings" />
      <Typography variant="h5">General Settings</Typography>
      <br />
      <FormControl fullWidth>
        <Stack direction="column" spacing={DefaultSpacing}>
          <ConfigurableControl description="The name that uniquely identifies this worker.">
            <TextField required label="Worker Name" value={settings.workerName} onChange={handleWorkerNameChange} error={isWorkerNameInvalid} helperText={workerNameValidationMessage} />
          </ConfigurableControl>
          <ConfigurableControl description="How often to poll the servers for updated statistics.">
            <TextField
              required
              label="Update Interval (minutes)"
              type="number"
              value={settings.updateInterval}
              onChange={handleUpdateIntervalChange}
              error={isUpdateIntervalInvalid}
              helperText={updateIntervalValidationMessage}
            />
          </ConfigurableControl>
          <ConfigurableControl description="How often to wait between invocations of the mining software.">
            <TextField label="Cooldown Interval (seconds)" type="number" value={settings.cooldownInterval} onChange={handleCooldownIntervalChange} />
          </ConfigurableControl>
        </Stack>
        <br />
        <Divider />
        <Typography variant="h5">Connection URLs</Typography>
        <br />
        <Stack direction="column" spacing={DefaultSpacing}>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the ethash algorithm.">
            <TextField required label="Ethash" value={pools.ethash} onChange={handleEthashUrlChanged} error={isEthashUrlInvalid} helperText={ethashValidationMessage} />
          </ConfigurableControl>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the etchash algorithm.">
            <TextField required label="Etchash" value={pools.etchash} onChange={handleEtchashUrlChanged} error={isEtchashUrlInvalid} helperText={etchashValidationMessage} />
          </ConfigurableControl>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the kawpaw algorithm.">
            <TextField required label="Kawpaw" value={pools.kawpaw} onChange={handleKawpawUrlChanged} error={isKawpawUrlInvalid} helperText={kawpawValidationMessage} />
          </ConfigurableControl>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the randomx algorithm.">
            <TextField required label="RandomX" value={pools.randomx} onChange={handleRandomXUrlChanged} error={isRandomxUrlInvalid} helperText={randomxValidationMessage} />
          </ConfigurableControl>
        </Stack>
        <br />
        <Divider />
        <Stack direction="row">
          <Button disabled={isFormInvalid} onClick={onSave}>
            Save Changes
          </Button>
        </Stack>
      </FormControl>
    </Container>
  );
}
