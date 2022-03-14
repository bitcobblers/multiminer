/* eslint-disable react/jsx-props-no-spreading */

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { AVAILABLE_ALGORITHMS, AVAILABLE_MINERS, Miner } from '../../models';
import { AlgorithmMenuItem, MinerTypeMenuItem } from '../components';
import { CustomDialogActions } from './CustomDialogActions';
import { dialogApi } from '../../shared/DialogApi';

type EditMinerDialogProps = {
  open: boolean;
  miner: Miner;
  existingMiners: Miner[];

  onSave: (miner: Miner) => void;
  onCancel: () => void;
};

export function EditMinerDialog(props: EditMinerDialogProps) {
  const { open, miner, existingMiners, onSave, onCancel, ...other } = props;

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Omit<Miner, 'id'>>({ defaultValues: miner, mode: 'all' });

  const kind = watch('kind');

  const minerTypeAlgorithms = useMemo(() => {
    const selectedMiner = AVAILABLE_MINERS.find((m) => m.name === kind);
    const selectedMinerAlgorithms = selectedMiner?.algorithms ?? [];
    return AVAILABLE_ALGORITHMS.filter((alg) => selectedMinerAlgorithms.includes(alg.name));
  }, [kind]);

  const handleOnSave = handleSubmit((val) => onSave({ ...val, id: miner.id }));

  const handleOnCancel = () => {
    reset(miner);
    onCancel();
  };

  const pickAlgorithm = (current: string) => {
    if (current !== undefined && minerTypeAlgorithms.find((alg) => alg.name === current)) {
      return current;
    }

    return minerTypeAlgorithms[0].name;
  };

  const browseFolder = async () => {
    const path = await dialogApi.getPath();

    if (path !== '') {
      setValue('installationPath', path);
    }
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
      <DialogTitle sx={{ textAlign: 'center' }}>Edit Miner</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleOnSave}>
          <FormControl fullWidth>
            <Stack spacing={2}>
              <FormControlLabel label="Enabled" control={<Switch name="enabled" checked={watch('enabled')} inputRef={register('enabled').ref} onChange={register('enabled').onChange} />} />
              <TextField
                required
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
                {AVAILABLE_MINERS.sort((a, b) => a.name.localeCompare(b.name)).map((m) => (
                  <MenuItem key={m.name} value={m.name}>
                    <MinerTypeMenuItem miner={m} />
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
              <Stack direction="row">
                <TextField
                  required
                  disabled
                  label="Installation Path"
                  value={watch('installationPath') ?? ''}
                  {...register('installationPath', {
                    required: 'The path to the miner installation must be provided.',
                  })}
                  error={!!errors?.installationPath}
                  helperText={errors?.installationPath?.message}
                />
                <Button onClick={browseFolder}>Browse</Button>
              </Stack>
              <TextField label="Parameters" {...register('parameters')} value={watch('parameters') ?? ''} />
              <Divider />
              <CustomDialogActions buttonType="submit" onCancel={handleOnCancel} />
            </Stack>
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  );
}
