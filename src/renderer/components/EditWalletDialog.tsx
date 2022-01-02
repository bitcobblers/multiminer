/* eslint-disable react/destructuring-assignment */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, Typography, Grid, FormControl, Divider } from '@mui/material';
import { Wallet } from '../../models/Wallet';
import { AllChains } from '../../models/Chains';

interface EditWalletDialogState {
  isInvalid: boolean;
  originalName?: string;
  name?: string;
  network?: string;
  address?: string;
  memo?: string;
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
      isInvalid: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnNameChange = (e: any) => {
    const { wallet } = this.props;
    const { originalName } = this.state;

    if (originalName === undefined) {
      this.setState({
        originalName: wallet.name,
        name: e.target.value,
      });
    } else {
      this.setState({
        name: e.target.value,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnNetworkChange = (e: any) => {
    this.setState({
      network: e.target.value,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnAddressChange = (e: any) => {
    this.setState({
      address: e.target.value,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOnMemoChange = (e: any) => {
    this.setState({
      memo: e.target.value,
    });
  };

  handleOnSave = () => {
    const { wallet, onSave } = this.props;
    const { name, network, address, memo } = this.state;

    onSave({
      name: name ?? wallet.name,
      network: network ?? wallet.network,
      address: address ?? wallet.address,
      memo: memo ?? wallet.memo,
    });

    this.clearForm();
  };

  handleOnCancel = () => {
    const { onCancel } = this.props;

    this.clearForm();
    onCancel();
  };

  clearForm = () => {
    this.setState({
      name: undefined,
      network: undefined,
      address: undefined,
      memo: undefined,
    });
  };

  formatSaveButton = () => (this.props.isNew ? 'Add Wallet' : 'Save Changes');

  formatTitle = () => (this.props.isNew ? 'New Wallet' : 'Edit Wallet');

  render() {
    const { open, wallet, onCancel, onSave, isNew, existingWallets, ...other } = this.props;
    const { isInvalid } = this.state;

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
        <DialogTitle>{this.formatTitle()}</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            <Stack spacing={2}>
              <TextField required label="Name" defaultValue={wallet.name} onChange={this.handleOnNameChange} />
              <TextField required label="Network" select defaultValue={wallet.network} onChange={this.handleOnNetworkChange}>
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
              <TextField required label="Address" defaultValue={wallet.address} onChange={this.handleOnAddressChange} />
              <TextField label="Memo" defaultValue={wallet.memo} onChange={this.handleOnMemoChange} />
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
