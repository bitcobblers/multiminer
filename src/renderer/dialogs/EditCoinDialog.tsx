/* eslint-disable react/jsx-props-no-spreading */

import { useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { Chip, DialogTitle, DialogContent, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { Wallet, Coin } from '../../models';
import { WalletMenuItem } from '../components/WalletMenuItem';
import { CustomDialogActions } from './CustomDialogActions';

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
    setValue,
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

  const pickWallet = (current: string | null) => {
    if (current === null) {
      if (compatibleWallets.length > 0) {
        setValue('wallet', compatibleWallets[0].name);
        return compatibleWallets[0].name;
      }

      return '';
    }

    return current;
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
      <DialogTitle sx={{ textAlign: 'center' }}>Edit Coin</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleOnSave}>
          <FormControl fullWidth>
            <img src={icon} alt={symbol} height={60} />
            <Stack spacing={2}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.2rem' }}>Networks: </span>
                {blockchains
                  .sort((a, b) => a.localeCompare(b))
                  .map((n) => (
                    <Chip key={n} label={n} />
                  ))}
              </div>
              <Divider />
              <FormControlLabel label="Enabled" control={<Switch name="enabled" checked={watch('enabled')} inputRef={register('enabled').ref} onChange={register('enabled').onChange} />} />
              <TextField
                label={walletLabel()}
                select
                disabled={shouldDisableWalletSelection()}
                {...register('wallet', {
                  validate: (wallet) => {
                    const enabled = watch('enabled');
                    return enabled && !wallet ? 'A wallet must be specified.' : true;
                  },
                })}
                error={!!errors?.wallet}
                helperText={errors?.wallet?.message}
                value={pickWallet(watch('wallet'))}
              >
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
                value={Number(watch('duration') ?? 1)}
                {...register('duration', {
                  required: 'A duration in hours must be specified.',
                  min: { value: 1, message: 'The duration must be at least 1 hour.' },
                  valueAsNumber: true,
                })}
                error={!!errors?.duration}
                helperText={errors?.duration?.message}
              />
            </Stack>
            <CustomDialogActions buttonType="submit" onCancel={handleOnCancel} />
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  );
}
