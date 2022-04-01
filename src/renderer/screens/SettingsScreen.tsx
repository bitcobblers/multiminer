import { Button, Container, Divider, FormControl, Stack, TextField, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { AppSettings, DefaultSettings } from 'models';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ConfigurableControl, ScreenHeader } from '../components';
import { getAppSettings, setAppSettings } from '../services/AppSettingsService';
import { dialogApi } from '../../shared/DialogApi';
import { settingsApi } from '../../shared/SettingsApi';

// react-hook-form's API requires prop spreading to register controls
/* eslint-disable react/jsx-props-no-spreading */
export function SettingsScreen() {
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<AppSettings>({ defaultValues: DefaultSettings.settings });

  useEffect(() => {
    getAppSettings()
      .then((s) => reset(s))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(`Unable to load settings: ${error}`);
      });
  }, [reset]);

  const onSave = handleSubmit(async (value) => {
    await setAppSettings(value);
    enqueueSnackbar('Settings updated.', {
      variant: 'success',
    });
  });

  const onReset = () => {
    reset(DefaultSettings.settings);
  };

  const onExport = async () => {
    const path = await dialogApi.getSaveFile();

    if (path !== '') {
      const result = await settingsApi.exportSettings(path);

      if (result) {
        enqueueSnackbar(`Export settings failed: ${result}.`, { variant: 'error' });
      } else {
        enqueueSnackbar('Settings exported', { variant: 'success' });
      }
    }
  };

  const onImport = async () => {
    const path = await dialogApi.getOpenFile();

    if (path !== '') {
      const result = await settingsApi.importSettings(path);

      if (result) {
        enqueueSnackbar(`Import settings failed: ${result}.`, { variant: 'error' });
      } else {
        enqueueSnackbar('Settings imported', { variant: 'success' });
      }
    }
  };

  const DefaultSpacing = 2;

  return (
    <Container>
      <ScreenHeader title="Settings">
        <Button startIcon={<DownloadIcon />} onClick={onExport}>
          Export
        </Button>
        <Button startIcon={<UploadIcon />} onClick={onImport}>
          Import
        </Button>
        <Button startIcon={<SettingsBackupRestoreIcon />} onClick={() => onReset()}>
          Restore Defaults
        </Button>
      </ScreenHeader>
      <Typography variant="h5" sx={{ my: 2 }}>
        General Settings
      </Typography>
      <FormControl fullWidth>
        <Stack direction="column" spacing={DefaultSpacing} sx={{ width: '15rem' }}>
          <ConfigurableControl description="The name that uniquely identifies this worker.">
            <TextField
              required
              label="Worker Name"
              fullWidth
              {...register('settings.workerName', {
                required: 'A worker name must be provided.',
                maxLength: { value: 30, message: 'A worker name cannot be more than 30 characters long.' },
                pattern: { value: /^[a-zA-Z0-9\-_]+/, message: "The worker name must only contain letters numbers, or a '-' and '_' symbol." },
              })}
              error={!!errors?.settings?.workerName}
              helperText={errors?.settings?.workerName?.message}
            />
          </ConfigurableControl>
          <ConfigurableControl description="How often to wait between invocations of the mining software.">
            <TextField label="Cooldown Interval (seconds)" fullWidth type="number" {...register('settings.cooldownInterval')} />
          </ConfigurableControl>
        </Stack>
        <Stack sx={{ width: '25rem', mt: 2 }}>
          <ConfigurableControl description="The optional proxy server to use for network calls.">
            <TextField label="Proxy Server" {...register('settings.proxy')} fullWidth />
          </ConfigurableControl>
        </Stack>
        <Divider sx={{ mt: 2 }} />
        <Typography variant="h5" sx={{ my: 2 }}>
          Connection URLs
        </Typography>
        <Stack direction="column" spacing={DefaultSpacing} sx={{ width: '25rem' }}>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the ethash algorithm.">
            <TextField
              required
              label="Ethash"
              fullWidth
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
              fullWidth
              {...register('pools.etchash', {
                required: 'A pool url must be specified.',
              })}
              error={!!errors?.pools?.etchash}
              helperText={errors?.pools?.etchash?.message}
            />
          </ConfigurableControl>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the kawpow algorithm.">
            <TextField
              required
              label="Kawpow"
              fullWidth
              {...register('pools.kawpow', {
                required: 'A pool url must be specified.',
              })}
              error={!!errors?.pools?.kawpow}
              helperText={errors?.pools?.kawpow?.message}
            />
          </ConfigurableControl>
          <ConfigurableControl description="The URL to use when connecting to a mining pool using the randomx algorithm.">
            <TextField
              required
              label="RandomX"
              fullWidth
              {...register('pools.randomx', {
                required: 'A pool url must be specified.',
              })}
              error={!!errors?.pools?.randomx}
              helperText={errors?.pools?.randomx?.message}
            />
          </ConfigurableControl>
        </Stack>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Stack direction="row">
          <Button disabled={!isValid} onClick={onSave}>
            Save Changes
          </Button>
        </Stack>
      </FormControl>
    </Container>
  );
}
