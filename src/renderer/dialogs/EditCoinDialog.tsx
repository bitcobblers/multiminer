/* eslint-disable react/jsx-props-no-spreading */

import { useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { Chip, DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { Wallet, Coin } from '../../models';
import { WalletMenuItem } from '../components/WalletMenuItem';

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
    reset,
  } = useForm<Coin>({ defaultValues: coin, mode: 'all' });

  const handleOnSave = handleSubmit((value) => {
    onSave(value);
  });

  const handleOnCancel = () => {
    reset(coin);
    onCancel();
  };

  const compatibleWallets = wallets.filter((w) => blockchains.includes(w.network));

  const shouldDisableWalletSelection = () => {
    return compatibleWallets.length === 0;
  };

  const walletLabel = () => {
    return compatibleWallets.length === 0 ? 'No compatible wallets' : 'Wallet';
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
      <DialogTitle>Edit Coin</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleOnSave}>
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
              <FormControlLabel label="Enabled" control={<Switch name="enabled" checked={watch('enabled')} inputRef={register('enabled').ref} onChange={register('enabled').onChange} />} />
              <TextField label={walletLabel()} select disabled={shouldDisableWalletSelection()} {...register('wallet')} value={watch('wallet') ?? null}>
                {compatibleWallets
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((w) => (
                    <MenuItem key={w.name} value={w.name}>
                      <WalletMenuItem wallet={w} />
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                required
                type="number"
                label="Duration (hours)"
                value={watch('duration') ?? null}
                {...register('duration', {
                  required: 'A duration in hours must be specified.',
                  min: { value: 1, message: 'The duration must be at least 1 hour or more.' },
                })}
                error={!!errors?.duration}
                helperText={errors?.duration?.message}
              />
              <Divider />
            </Stack>
            <Button type="submit">Save</Button>
            <Button onClick={handleOnCancel}>Cancel</Button>
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  );
}
