/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Chip, DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { Wallet, Coin, AvailableAlgorithms } from '../../models/Configuration';
import { WalletMenuItem } from '../components/WalletMenuItem';
import { AlgorithmMenuItem } from '../components/AlgorithmMenuItem';

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
  const [wallet, setWallet] = useState(coin.wallet);
  const [algorithm, setAlgorithm] = useState(coin.algorithm);
  const [enabled, setEnabled] = useState(coin.enabled);
  const [duration, setDuration] = useState(coin.duration);
  const [referral, setReferral] = useState(coin.referral);

  const handleOnWalletChange = (e: any) => {
    setWallet(e.target.value.trim());
  };

  const handleOnAlgorithmChange = (e: any) => {
    setAlgorithm(e.target.value.trim());
  };

  const handleOnDurationChange = (e: any) => {
    setDuration(e.target.value.trim());
  };

  const handleOnReferralChange = (e: any) => {
    setReferral(e.target.value.trim());
  };

  const handleOnEnabledChange = (e: any) => {
    setEnabled(e.target.checked);
  };

  const handleOnSave = () => {
    onSave({ symbol, wallet, algorithm, enabled, duration, referral });
  };

  const handleOnCancel = () => {
    onCancel();
  };

  const validateWallet = (): [boolean, string] => {
    if (wallet.length === 0) {
      return [true, 'A wallet must be specified.'];
    }

    return [false, ''];
  };

  const validateAlgorithm = (): [boolean, string] => {
    if (algorithm.length === 0) {
      return [true, 'An algorithm must be specified.'];
    }

    return [false, ''];
  };

  const validateDuration = (): [boolean, string] => {
    if ((duration as string) === '') {
      return [true, 'An duration in hours must be specified.'];
    }

    if ((duration as number) < 1) {
      return [true, 'The duration must be at least 1 hour or more.'];
    }

    return [false, ''];
  };

  const [isWalletInvalid, walletValidationMessage] = validateWallet();
  const [isAlgorithmInvalid, algorithmValidationMessage] = validateAlgorithm();
  const [isDurationInvalid, durationValidationMessage] = validateDuration();
  const isInvalid = enabled ? isWalletInvalid || isAlgorithmInvalid || isDurationInvalid : false;

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
            <FormControlLabel control={<Switch checked={enabled} onChange={handleOnEnabledChange} />} label="Enabled" />
            <TextField disabled={!enabled} required label="Wallet" select value={wallet} onChange={handleOnWalletChange} error={isWalletInvalid} helperText={walletValidationMessage}>
              {wallets
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((w) => (
                  <MenuItem key={w.name} value={w.name}>
                    <WalletMenuItem wallet={w} />
                  </MenuItem>
                ))}
            </TextField>
            <TextField disabled={!enabled} required label="Miner" select value={algorithm} onChange={handleOnAlgorithmChange} error={isAlgorithmInvalid} helperText={algorithmValidationMessage}>
              {AvailableAlgorithms.sort((a, b) => a.name.localeCompare(b.name)).map((alg) => (
                <MenuItem key={alg.name} value={alg.name}>
                  <AlgorithmMenuItem algorithm={alg} />
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={!enabled}
              required
              type="number"
              label="Duration (hours)"
              defaultValue={duration}
              onChange={handleOnDurationChange}
              error={isDurationInvalid}
              helperText={durationValidationMessage}
            />
            <TextField disabled={!enabled} label="Referral" defaultValue={referral} onChange={handleOnReferralChange} />
            <Divider />
          </Stack>
          <Button onClick={handleOnSave} disabled={isInvalid}>
            Save
          </Button>
          <Button onClick={handleOnCancel}>Cancel</Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
