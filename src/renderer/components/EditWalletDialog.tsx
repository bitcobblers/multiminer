/* eslint-disable react/destructuring-assignment */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, Typography, Grid, FormControl, Divider } from '@mui/material';
import { Wallet } from '../../models/Wallet';
import { Chain, AllChains } from '../../models/Chains';

interface EditWalletDialogState {
  name: string;
  network: string;
  address: string;
  memo: string;
  chain?: Chain;
}

interface EditWalletDialogProps {
  open: boolean;
  wallet: Wallet;
  isNew: boolean;
  existingWallets: Wallet[];
  onSave: (wallet: Wallet) => void;
  onCancel: () => void;
}

export class EditWalletDialog extends React.Component<EditWalletDialogProps, EditWalletDialogState> {
  constructor(props: EditWalletDialogProps) {
    super(props);

    this.state = {
      name: props.wallet.name,
      network: props.wallet.network,
      address: props.wallet.address,
      memo: props.wallet.memo,
      chain: AllChains.find((c) => c.name === props.wallet.network),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnNameChange = (e: any) => {
    this.setState({
      name: e.target.value.trim(),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnNetworkChange = (e: any) => {
    const network = e.target.value.trim();

    this.setState({
      network,
      chain: AllChains.find((c) => c.name === network),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnAddressChange = (e: any) => {
    this.setState({
      address: e.target.value.trim(),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnMemoChange = (e: any) => {
    this.setState({
      memo: e.target.value.trim(),
    });
  };

  handleOnSave = () => {
    const { wallet, onSave } = this.props;
    const { name, network, address, memo } = this.state;

    onSave({ id: wallet.id, name, network, address, memo });
  };

  handleOnCancel = () => {
    this.props.onCancel();
  };

  validateName = (): [boolean, string] => {
    const { name } = this.state;
    const { wallet, existingWallets } = this.props;

    if (name.length === 0) {
      return [true, 'A wallet name must be provided.'];
    }

    if (existingWallets.find((w) => w.name === name) !== undefined && name !== wallet.name) {
      return [true, 'Wallet name already in use.'];
    }

    return [false, ''];
  };

  validateAddress = (): [boolean, string] => {
    const { address, chain } = this.state;
    const addressFormat = chain?.token_format;

    if (address.length === 0) {
      return [true, 'A network address must be provided.'];
    }

    if (addressFormat === undefined || address.match(addressFormat)) {
      return [false, ''];
    }

    return [true, 'The address provided does not match the format expected for this network.'];
  };

  validateMemo = (): [boolean, string] => {
    const { memo, chain } = this.state;
    const memoFormat = chain?.memo_format;

    if (memo.length === 0 || memoFormat === undefined || memo.match(memoFormat)) {
      return [false, ''];
    }

    return [true, 'The memo provided does not match the format expected for this network.'];
  };

  formatSaveButton = () => (this.props.isNew ? 'Add Wallet' : 'Save Changes');

  formatTitle = () => (this.props.isNew ? 'New Wallet' : 'Edit Wallet');

  render() {
    const { open, wallet, isNew, existingWallets, onSave, onCancel, ...other } = this.props;

    const [isNameInvalid, nameValidationMessage] = this.validateName();
    const [isAddressInvalid, addressValidationMessage] = this.validateAddress();
    const [isMemoInvalid, memoValidationMessage] = this.validateMemo();

    const isInvalid = isNameInvalid;

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
        <DialogTitle>{this.formatTitle()}</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            <Stack spacing={2}>
              <TextField required label="Name" defaultValue={wallet.name} onChange={this.handleOnNameChange} error={isNameInvalid} helperText={nameValidationMessage} />
              <TextField required label="Network" select value={this.state.network} onChange={this.handleOnNetworkChange}>
                {AllChains.sort((a, b) => a.name.localeCompare(b.name)).map((n) => (
                  <MenuItem key={n.name} value={n.name}>
                    <Grid container>
                      <Grid item xs={3}>
                        <Typography>{n.name}</Typography>
                      </Grid>
                      <Grid>
                        <Typography>{n.description}</Typography>
                      </Grid>
                    </Grid>
                  </MenuItem>
                ))}
              </TextField>
              <TextField required label="Address" defaultValue={wallet.address} onChange={this.handleOnAddressChange} error={isAddressInvalid} helperText={addressValidationMessage} />
              <TextField label="Memo" defaultValue={wallet.memo} onChange={this.handleOnMemoChange} error={isMemoInvalid} helperText={memoValidationMessage} />
              <Divider />
            </Stack>
            <Button onClick={this.handleOnSave} disabled={isInvalid}>
              {this.formatSaveButton()}
            </Button>
            <Button onClick={this.handleOnCancel}>Cancel</Button>
          </FormControl>
        </DialogContent>
      </Dialog>
    );
  }
}
