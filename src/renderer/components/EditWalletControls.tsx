import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Stack, Tooltip, IconButton } from '@mui/material';

import { Wallet, Coin } from '../../models';
import { EditWalletDialog, RemoveWalletDialog } from '../dialogs';

interface EditWalletControlsState {
  editOpen: boolean;
  removeOpen: boolean;
}

interface EditWalletControlsProps {
  wallet: Wallet;
  existingWallets: Wallet[];
  coins: Coin[];
  onEditSave: (wallet: Wallet) => void;
  onRemoveConfirm: (name: string, id: string) => void;
}

export class EditWalletControls extends React.Component<EditWalletControlsProps, EditWalletControlsState> {
  constructor(props: EditWalletControlsProps) {
    super(props);

    this.state = {
      editOpen: false,
      removeOpen: false,
    };
  }

  handleCancelEditWallet = () => {
    this.setState({
      editOpen: false,
    });
  };

  handleCancelRemoveWallet = () => {
    this.setState({
      removeOpen: false,
    });
  };

  handleSaveWallet = (wallet: Wallet) => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onEditSave(wallet);
    this.setState({
      editOpen: false,
    });
  };

  handleRemoveWallet = (name: string, id: string) => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onRemoveConfirm(name, id);
    this.setState({
      removeOpen: false,
    });
  };

  handleOpenRemoveDialog = () => {
    this.setState({
      removeOpen: true,
    });
  };

  handleOpenEditDialog = () => {
    this.setState({
      editOpen: true,
    });
  };

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { wallet, existingWallets, coins } = this.props;
    const { editOpen, removeOpen } = this.state;

    const usedCoins = coins.filter((c) => c.wallet === wallet.name);

    return (
      <Stack direction="row" spacing={1}>
        <EditWalletDialog open={editOpen} wallet={wallet} existingWallets={existingWallets} coins={usedCoins} isNew={false} onCancel={this.handleCancelEditWallet} onSave={this.handleSaveWallet} />
        <RemoveWalletDialog open={removeOpen} name={wallet.name} id={wallet.id} coins={usedCoins} onCancel={this.handleCancelRemoveWallet} onRemove={this.handleRemoveWallet} />
        <Tooltip title="Remove Wallet">
          <IconButton aria-label="Remove Wallet" onClick={this.handleOpenRemoveDialog}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Wallet">
          <IconButton aria-label="Edit Wallet" onClick={this.handleOpenEditDialog}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  }
}
