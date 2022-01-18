/* eslint-disable react/destructuring-assignment */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import { Chip, DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { Wallet, Coin, AvailableAlgorithms } from '../../models/Configuration';
import { WalletMenuItem } from '../components/WalletMenuItem';
import { AlgorithmMenuItem } from '../components/AlgorithmMenuItem';

interface EditCoinDialogState {
  wallet: string;
  algorithm: string;
  enabled: boolean;
  duration: number | string;
  referral: string;
}

interface EditCoinDialogProps {
  open: boolean;
  icon: string;
  symbol: string;
  blockchains: string[];
  wallets: Wallet[];
  coin: Coin;

  onSave: (coin: Coin) => void;
  onCancel: () => void;
}

export class EditCoinDialog extends React.Component<EditCoinDialogProps, EditCoinDialogState> {
  constructor(props: EditCoinDialogProps) {
    super(props);

    this.state = {
      wallet: props.coin.wallet,
      algorithm: props.coin.algorithm,
      enabled: props.coin.enabled,
      duration: props.coin.duration,
      referral: props.coin.referral,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnWalletChange = (e: any) => {
    this.setState({
      wallet: e.target.value.trim(),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnAlgorithmChange = (e: any) => {
    this.setState({
      algorithm: e.target.value.trim(),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnDurationChange = (e: any) => {
    this.setState({
      duration: e.target.value.trim(),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnReferralChange = (e: any) => {
    this.setState({
      referral: e.target.value.trim(),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnEnabledChange = (e: any) => {
    this.setState({
      enabled: e.target.checked,
    });
  };

  handleOnSave = () => {
    const { symbol, onSave } = this.props;
    const { wallet, algorithm, enabled, duration, referral } = this.state;

    onSave({ symbol, wallet, algorithm, enabled, duration, referral });
  };

  handleOnCancel = () => {
    this.props.onCancel();
  };

  validateWallet = (): [boolean, string] => {
    const { wallet } = this.state;

    if (wallet.length === 0) {
      return [true, 'A wallet must be specified.'];
    }

    return [false, ''];
  };

  validateAlgorithm = (): [boolean, string] => {
    const { algorithm } = this.state;

    if (algorithm.length === 0) {
      return [true, 'An algorithm must be specified.'];
    }

    return [false, ''];
  };

  validateDuration = (): [boolean, string] => {
    const { duration } = this.state;

    if ((duration as string) === '') {
      return [true, 'An duration in hours must be specified.'];
    }

    if ((duration as number) < 1) {
      return [true, 'The duration must be at least 1 hour or more.'];
    }

    return [false, ''];
  };

  render() {
    const { open, icon, symbol, wallets, blockchains, coin, onSave, onCancel, ...other } = this.props;
    const { enabled } = this.state;

    const [isWalletInvalid, walletValidationMessage] = this.validateWallet();
    const [isAlgorithmInvalid, algorithmValidationMessage] = this.validateAlgorithm();
    const [isDurationInvalid, durationValidationMessage] = this.validateDuration();

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
              <FormControlLabel control={<Switch checked={this.state.enabled} onChange={this.handleOnEnabledChange} />} label="Enabled" />
              <TextField disabled={!enabled} required label="Wallet" select value={this.state.wallet} onChange={this.handleOnWalletChange} error={isWalletInvalid} helperText={walletValidationMessage}>
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
                label="Algorithm"
                select
                value={this.state.algorithm}
                onChange={this.handleOnAlgorithmChange}
                error={isAlgorithmInvalid}
                helperText={algorithmValidationMessage}
              >
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
                defaultValue={this.state.duration}
                onChange={this.handleOnDurationChange}
                error={isDurationInvalid}
                helperText={durationValidationMessage}
              />
              <TextField disabled={!enabled} label="Referral" defaultValue={this.state.referral} onChange={this.handleOnReferralChange} />
              <Divider />
            </Stack>
            <Button onClick={this.handleOnSave} disabled={isInvalid}>
              Save
            </Button>
            <Button onClick={this.handleOnCancel}>Cancel</Button>
          </FormControl>
        </DialogContent>
      </Dialog>
    );
  }
}
