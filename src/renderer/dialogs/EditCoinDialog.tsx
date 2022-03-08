import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Chip, DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { Wallet, Coin } from '../../models/Configuration';
import { WalletMenuItem } from '../components/WalletMenuItem';
import { useForm } from 'react-hook-form';

type EditCoinDialogProps = {
  open: boolean;
  icon: string;
  symbol: string;
  blockchains: string[];
  wallets: Wallet[];
  coin: Coin;

  onSave: (coin: Coin) => void;
  onCancel: () => void;
};

export function EditCoinDialog(props: EditCoinDialogProps) {
  const { open, icon, symbol, wallets, blockchains, coin, onSave, onCancel, ...other } = props;

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<Coin>({ defaultValues: coin });

  const enabled = watch('enabled');

  const handleOnSave = handleSubmit((val) => onSave(val));

  const handleOnCancel = () => {
    onCancel();
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
      <DialogTitle>Edit Coin</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <img src={icon} alt={symbol} height={60} />
            <div>
              {blockchains
                .sort((a, b) => a.localeCompare(b))
                .map((n) => (
                  <Chip key={n} label={n} />
                ))}
            </div>
            <Divider />
            <FormControlLabel control={<Switch checked={enabled} {...register('enabled')} />} label="Enabled" />
            <TextField disabled={!enabled} required label="Wallet" {...register('wallet', { required: 'A wallet must be specified.' })} error={!!errors.wallet} helperText={errors.wallet?.message}>
              {wallets
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((w) => (
                  <MenuItem key={w.name} value={w.name}>
                    <WalletMenuItem wallet={w} />
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              disabled={!enabled}
              required
              type="number"
              label="Duration (hours)"
              value={watch('duration') ?? null}
              {...register('duration', {
                required: 'A duration in hours must be specified.',
                min: {value: 1, message: 'The duration must be at least 1 hour or more.'},
              })}
              error={!!errors?.duration}
              helperText={errors?.duration?.message}
            />
            <TextField disabled={!enabled} label="Referral" {...register('referral')} />
            <Divider />
          </Stack>
          <Button onClick={handleOnSave}>Save</Button>
          <Button onClick={handleOnCancel}>Cancel</Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
