/* eslint-disable react/jsx-props-no-spreading */

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, TextField, Stack, MenuItem, FormControl, Divider, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { AlgorithmName, AVAILABLE_ALGORITHMS, AVAILABLE_MINERS, Miner, MinerInfo, MinerRelease } from '../../models';
import { AlgorithmMenuItem, MinerTypeMenuItem } from '../components';
import { CustomDialogActions } from './CustomDialogActions';
import { aboutApi } from '../../shared/AboutApi';
import { useLoadData } from '../hooks';
import { getMinerReleases as getMinerReleasesOnline } from '../services/DownloadManager';

type EditMinerDialogProps = {
  open: boolean;
  miner: Miner;
  existingMiners: Miner[];
  autoReset: boolean;
  onSave: (miner: Miner) => void;
  onCancel: () => void;
};

export function EditMinerDialog(props: EditMinerDialogProps) {
  const { open, miner, existingMiners, autoReset, onSave, onCancel, ...other } = props;

  const [availableMiners, setAvailableMiners] = useState(Array<MinerRelease>());

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Miner, 'id'>>({ defaultValues: miner, mode: 'all' });

  const kind = watch('kind');

  const minerTypeAlgorithms = useMemo(() => {
    const selectedMiner = AVAILABLE_MINERS.find((m) => m.name === kind);
    const selectedMinerAlgorithms = selectedMiner?.algorithms ?? [];
    return AVAILABLE_ALGORITHMS.filter((alg) => selectedMinerAlgorithms.includes(alg.name));
  }, [kind]);

  const minerTypeVersions = useMemo(() => {
    const selectedMiner = availableMiners.find((m) => m.name === kind);
    return selectedMiner?.versions.map((r) => r.tag) ?? [];
  }, [availableMiners, kind]);

  const availableMinersAsMinerInfo = useMemo(() => availableMiners.map((m) => AVAILABLE_MINERS.find((x) => x.name === m.name)).filter((m) => m !== undefined) as MinerInfo[], [availableMiners]);

  useLoadData(async ({ getMinerReleases }) => {
    const onlineMiners = await getMinerReleasesOnline();

    if (onlineMiners.length > 0) {
      setAvailableMiners(onlineMiners);
    } else {
      setAvailableMiners(await getMinerReleases());
    }
  });

  const pickAlgorithm = (current: AlgorithmName) => {
    if (current !== undefined && minerTypeAlgorithms.find((alg) => alg.name === current)) {
      return current;
    }

    return minerTypeAlgorithms[0].name;
  };

  const pickVersion = (current: string) => {
    if (current === undefined || minerTypeVersions.includes(current) === false) {
      return minerTypeVersions[0];
    }

    return current;
  };

  const handleOnSave = handleSubmit((val) => {
    const version = pickVersion(watch('version'));
    const algorithm = pickAlgorithm(watch('algorithm'));

    onSave({ ...val, id: miner.id, version, algorithm });

    if (autoReset) {
      reset(miner);
    }
  });

  const handleOnCancel = () => {
    reset(miner);
    onCancel();
  };

  const openReference = () => {
    const currentMiner = availableMinersAsMinerInfo.find((m) => m.name === kind);

    if (currentMiner !== undefined) {
      aboutApi.openBrowser(currentMiner.optionsUrl);
    }
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '550px' } }} open={open} {...other}>
      <DialogTitle sx={{ textAlign: 'center' }}>Edit Miner</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleOnSave}>
          <FormControl fullWidth>
            <Stack spacing={2}>
              <TextField
                required
                autoFocus
                spellCheck="false"
                label="Name"
                value={watch('name') ?? null}
                {...register('name', {
                  required: 'A miner must have a name',
                  validate: (val) => (existingMiners.filter((m) => m.id !== miner.id).find((m) => m.name === val) ? 'A miner already exists with the same name.' : undefined),
                })}
                error={!!errors?.name}
                helperText={errors?.name?.message}
              />
              <TextField required label="Miner" select value={watch('kind')} {...register('kind')}>
                {availableMinersAsMinerInfo
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((m) => (
                    <MenuItem key={m.name} value={m.name}>
                      <MinerTypeMenuItem miner={m} />
                    </MenuItem>
                  ))}
              </TextField>
              <TextField required label="Version" select value={pickVersion(watch('version'))} {...register('version')}>
                {minerTypeVersions.map((version) => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                ))}
              </TextField>
              <TextField required label="Algorithm" select value={pickAlgorithm(watch('algorithm'))} {...register('algorithm')}>
                {minerTypeAlgorithms.map((alg) => (
                  <MenuItem key={alg.name} value={alg.name}>
                    <AlgorithmMenuItem algorithm={alg} />
                  </MenuItem>
                ))}
              </TextField>
              <Stack direction="row" gap={1} alignItems="center">
                <TextField style={{ width: '22rem' }} spellCheck="false" label="Parameters" {...register('parameters')} value={watch('parameters') ?? ''} />
                <Button startIcon={<OpenInNewIcon />} size="small" variant="outlined" onClick={openReference}>
                  Reference
                </Button>
              </Stack>
              <Divider />
              <CustomDialogActions buttonType="submit" onCancel={handleOnCancel} />
            </Stack>
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  );
}
