import MenuIcon from '@mui/icons-material/MoreVert';
import { Button, Container, Divider, FormControl, Stack, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AppSettings } from 'models/AppSettings';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ConfigurableControl, ScreenHeader } from '../components';
import { defaults, getAppSettings, setAppSettings } from '../services/AppSettingsService';

function SettingsMenu(props: { onReset: () => unknown }) {
  const { onReset } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
        {/* TODO: add import/export functionality (https://github.com/bitcobblers/multiminer/issues/36) */}
        {/* <MenuItem>Import</MenuItem>
        <MenuItem>Export</MenuItem> */}
        <MenuItem onClick={() => onReset()}>Restore Defaults</MenuItem>
      </Menu>
    </div>
  );
}

// react-hook-form's API requires prop spreading to register controls
/* eslint-disable react/jsx-props-no-spreading */
export function SettingsScreen() {
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<AppSettings>({ defaultValues: defaults.settings });

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
    reset(defaults.settings);
  };

  const DefaultSpacing = 2;

  return (
    <Container>
      <ScreenHeader title="Settings">
        <SettingsMenu onReset={onReset} />
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
          <ConfigurableControl description="How often to poll the servers for updated statistics.">
            <TextField
              required
              label="Update Interval (minutes)"
              fullWidth
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
