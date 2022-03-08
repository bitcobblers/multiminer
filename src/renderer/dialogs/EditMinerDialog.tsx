import { Button, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AlgorithmName, AvailableAlgorithms, AvailableMiners, Miner, MinerName } from '../../models/Configuration';
import { AlgorithmMenuItem } from '../components/AlgorithmMenuItem';
import { MinerTypeMenuItem } from '../components/MinerTypeMenuItem';

interface EditMinerDialogProps {
  open: boolean;
  miner: Miner;

  onSave: (miner: Miner) => void;
  onCancel: () => void;
}

const getDefaultAlgorithm = (name: MinerName, algorithm: AlgorithmName): AlgorithmName => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const miner = AvailableMiners.find((m) => m.name === name)!;
  return miner.algorithms.includes(algorithm) ? algorithm : miner.algorithms[0];
};

// react-hook-form's API requires prop spreading to register controls
/* eslint-disable react/jsx-props-no-spreading */
export function EditMinerDialog(props: EditMinerDialogProps) {
  const { open, miner, onSave, onCancel, ...other } = props;

  const {
    register,
    unregister,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    getValues,
  } = useForm<Omit<Miner, 'id'>>({ defaultValues: miner });

  const kind = watch('kind');
  const algorithm = watch('algorithm');
  const isEnabled = watch('enabled');

  const minerTypeAlgorithms = useMemo(() => {
    const selectedMiner = AvailableMiners.find((m) => m.name === kind);
    const selectedMinerAlgorithms = selectedMiner?.algorithms ?? [];
    return AvailableAlgorithms.filter((alg) => selectedMinerAlgorithms.includes(alg.name));
  }, [kind]);

  // // ignore validation errors if disabled
  // useEffect(() => {
  //   if (!isValid && !isEnabled) {
  //     Object.keys(miner).forEach((x) => {
  //       unregister(x as keyof Omit<Miner, 'id'>);
  //     });
  //   }
  // }, [isEnabled]);

  const handleOnSave = handleSubmit((val) => onSave({ ...val, id: miner.id }));

  const handleOnCancel = () => {
    onCancel();
    reset();
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
      <DialogTitle>Edit Miner</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <FormControlLabel control={<Switch {...register('enabled')} checked={isEnabled} />} label="Enabled" />
            <TextField
              disabled={!isEnabled}
              label="Name"
              {...register('name', {
                validate: (val) => (getValues('enabled') ? (val ? undefined : 'A miner must have a name.') : undefined),
              })}
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
            <TextField
              disabled={!isEnabled}
              label="Miner"
              select
              {...register('kind', {
                required: 'A miner kind must be specified.',
              })}
              error={!!errors?.kind}
              helperText={errors?.kind?.message}
              value={watch('kind') ?? null}
            >
              {AvailableMiners.sort((a, b) => a.name.localeCompare(b.name)).map((m) => (
                <MenuItem key={m.name} value={m.name}>
                  <MinerTypeMenuItem miner={m} />
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={!isEnabled}
              label="Algorithm"
              select
              {...register('algorithm', {
                required: 'An algorithm must be specified.',
              })}
              error={!!errors?.algorithm}
              helperText={errors?.algorithm?.message}
              value={minerTypeAlgorithms.some((x) => x.name === algorithm) ? algorithm : getDefaultAlgorithm(kind, algorithm)}
            >
              {minerTypeAlgorithms.map((alg) => (
                <MenuItem key={alg.name} value={alg.name}>
                  <AlgorithmMenuItem algorithm={alg} />
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row">
              <TextField disabled={!isEnabled} label="Installation Path" {...register('installationPath')} />
              {/* TODO: add file browsing logic */}
              <Button disabled={!isEnabled}>Browse</Button>
            </Stack>
            <TextField disabled={!isEnabled} label="Parameters" {...register('installationPath')} />
            <Divider />
            <Button onClick={handleOnSave}>Save</Button>
            <Button onClick={handleOnCancel}>Cancel</Button>
          </Stack>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
