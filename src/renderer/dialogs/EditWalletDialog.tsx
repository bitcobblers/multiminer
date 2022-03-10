/* eslint-disable react/jsx-props-no-spreading */

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider } from '@mui/material';
import { Wallet, Coin, ALL_CHAINS } from '../../models';
import { ChainMenuItem, UsedByCoins } from '../components';

type EditWalletDialogProps = {
  open: boolean;
  coins: Coin[];
  wallet: Wallet;
  isNew: boolean;
  existingWallets: Wallet[];
  onSave: (wallet: Wallet) => void;
  onCancel: () => void;
};

export function EditWalletDialog(props: EditWalletDialogProps) {
  const { open, coins, wallet, isNew, existingWallets, onSave, onCancel } = props;

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Wallet, 'id'>>({ defaultValues: wallet, mode: 'all' });

  const chain = watch('network');

  const chainInfo = useMemo(() => {
    return ALL_CHAINS.find((c) => c.name === chain);
  }, [chain]);

  const shouldDisableBlockchainSelection = () => {
    return coins.length !== 0;
  };

  const blockchainLabel = () => {
    if (coins.length === 0) {
      return 'Blockchain';
    }
    if (coins.length === 1) {
      return 'Cannot change blockchain.  Already bound to 1 coin.';
    }
    return `Cannot change blockchain.  Already bound to ${coins.length} coins.`;
  };

  const handleOnSave = handleSubmit((val) => onSave({ ...val, id: wallet.id }));

  const handleOnCancel = () => {
    reset(wallet);
    onCancel();
  };

  const saveButtonTitle = isNew ? 'Add Wallet' : 'Save Changes';
  const title = isNew ? 'New Wallet' : 'Edit Wallet';

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField
              required
              label="Name"
              value={watch('name') ?? null}
              {...register('name', {
                required: 'A name is required for the wallet.',
                validate: (val) => (existingWallets.find((w) => w.name === val) ? 'A wallet already exists with this name.' : undefined),
              })}
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
            <TextField required label={blockchainLabel()} select disabled={shouldDisableBlockchainSelection()} value={watch('network') ?? null} {...register('network')}>
              {ALL_CHAINS.sort((a, b) => a.name.localeCompare(b.name)).map((n) => (
                <MenuItem key={n.name} value={n.name}>
                  <ChainMenuItem chain={n} />
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              label="Address"
              value={watch('address') ?? null}
              {...register('address', {
                required: 'An address is required for the wallet.',
                pattern: {
                  value: RegExp(chainInfo?.token_format ?? '/.*/'),
                  message: 'The address provided does not match the format expected for this blockchain.',
                },
              })}
              error={!!errors?.address}
              helperText={errors?.address?.message}
            />
            <TextField
              label="Memo"
              value={watch('memo') ?? null}
              {...register('memo', {
                pattern: {
                  value: RegExp(chainInfo?.memo_format ?? '/*/'),
                  message: 'The memo provided does not match the format expected for this blockchain.',
                },
              })}
              error={!!errors?.memo}
              helperText={errors?.memo?.message}
            />
            <UsedByCoins coins={coins} />
            <Divider />
          </Stack>
          <Button onClick={handleOnSave}>{saveButtonTitle}</Button>
          <Button onClick={handleOnCancel}>Cancel</Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
