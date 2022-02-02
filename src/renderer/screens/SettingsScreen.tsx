import { useEffect } from 'react';
import { Button, Stack, TextField, Container, Typography, Divider, FormControl } from '@mui/material';

import { ScreenHeader } from '../components/ScreenHeader';
import { ConfigurableControl } from '../components/ConfigurableControl';
import { AppSettingsService, defaults } from '../services/AppSettingsService';
import { useForm } from 'react-hook-form';
import { AppSettings } from 'models/Configuration';

interface SettingsScreenProps {
  appSettingsService: AppSettingsService;
}

export function SettingsScreen(props: SettingsScreenProps) {
  const { appSettingsService } = props;
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<AppSettings>({ defaultValues: defaults.settings });

  useEffect(() => {
    appSettingsService
      .getAppSettings()
      .then((s) => {
        reset(s);
        return s;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(`Unable to load settings: ${error}`);
      });
  }, [appSettingsService]);

  const onSave = handleSubmit(async (value) => {
    await appSettingsService.setAppSettings(value);
  });

  const DefaultSpacing = 2;

  return (
    <Container>
      <ScreenHeader title="Settings" />
      <Typography variant="h5">General Settings</Typography>
      <br />
      <FormControl fullWidth>
        <Stack direction="column" spacing={DefaultSpacing}>
          <ConfigurableControl description="The name that uniquely identifies this worker.">
            <TextField
              required
              label="Worker Name"
              {...register('settings.workerName', {
                required: 'A worker name must be provided.',
                maxLength: { value: 30, message: 'A worker name cannot be more than 30 characters long.' },
                pattern: { value: /^[a-zA-Z0-9\-_]+/, message: "The worker name must only contain letters numbers, or a '-' and '_' symbol." },
              })}
              error={!!errors?.settings?.workerName}
              helperText={errors?.settings?.workerName?.message}
            />
          </ConfigurableControl>
          <ConfigurableControl description="How often to poll the servers for updated statistics.">
            <TextField
              required
              label="Update Interval (minutes)"
              type="number"
              {...register('settings.updateInterval', {
                required: 'The interval must be specified.',
                minLength: { value: 5, message: 'The interval cannot be less than 5 minutes.' },
              })}
              error={!!errors.settings?.updateInterval}
              helperText={!!errors.settings?.updateInterval?.message}
            />
          </ConfigurableControl>
          <ConfigurableControl description="How often to wait between invocations of the mining software.">
            <TextField label="Cooldown Interval (seconds)" type="number" {...register('settings.cooldownInterval')} />
          </ConfigurableControl>
        </Stack>
        <br />
        <Divider />
        <Typography variant="h5">Connection URLs</Typography>
        <br />
        <Stack direction="column" spacing={DefaultSpacing}>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the ethash algorithm.">
            <TextField
              required
              label="Ethash"
              {...register('pools.ethash', {
                required: 'A pool url must be specified.',
              })}
              error={!!errors?.pools?.ethash}
              helperText={errors?.pools?.ethash?.message}
            />
          </ConfigurableControl>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the etchash algorithm.">
            <TextField
              required
              label="Etchash"
              {...register('pools.etchash', {
                required: 'A pool url must be specified.',
              })}
              error={!!errors?.pools?.etchash}
              helperText={errors?.pools?.etchash?.message}
            />
          </ConfigurableControl>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the kawpaw algorithm.">
            <TextField
              required
              label="Kawpaw"
              {...register('pools.kawpaw', {
                required: 'A pool url must be specified.',
              })}
              error={!!errors?.pools?.kawpaw}
              helperText={errors?.pools?.kawpaw?.message}
            />
          </ConfigurableControl>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the randomx algorithm.">
            <TextField
              required
              label="RandomX"
              {...register('pools.randomx', {
                required: 'A pool url must be specified.',
              })}
              error={!!errors?.pools?.randomx}
              helperText={errors?.pools?.randomx?.message}
            />
          </ConfigurableControl>
        </Stack>
        <br />
        <Divider />
        <Stack direction="row">
          <Button disabled={!isValid} onClick={onSave}>
            Save Changes
          </Button>
        </Stack>
      </FormControl>
    </Container>
  );
}
