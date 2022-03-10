/* eslint-disable react/jsx-props-no-spreading */

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { AVAILABLE_ALGORITHMS, AVAILABLE_MINERS, Miner } from '../../models';
import { AlgorithmMenuItem } from '../components/AlgorithmMenuItem';
import { MinerTypeMenuItem } from '../components/MinerTypeMenuItem';

type EditMinerDialogProps = {
  open: boolean;
  miner: Miner;

  onSave: (miner: Miner) => void;
  onCancel: () => void;
};

export function EditMinerDialog(props: EditMinerDialogProps) {
  const { open, miner, onSave, onCancel, ...other } = props;

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Miner, 'id'>>({ defaultValues: miner });

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

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
      <DialogTitle>Edit Miner</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <FormControlLabel label="Enabled" control={<Switch name="enabled" checked={watch('enabled')} inputRef={register('enabled').ref} onChange={register('enabled').onChange} />} />
            <TextField
              label="Name"
              {...register('name', {
                validate: (val) => (val === undefined ? 'A miner must have a name.' : undefined),
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
              <TextField label="Installation Path" {...register('installationPath')} value={watch('installationPath') ?? ''} />
              <Button>Browse</Button>
            </Stack>
            <TextField label="Parameters" {...register('parameters')} value={watch('parameters') ?? ''} />
            <Divider />
            <Button onClick={handleOnSave}>Save</Button>
            <Button onClick={handleOnCancel}>Cancel</Button>
          </Stack>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
