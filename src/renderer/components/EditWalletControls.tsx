import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from '@mui/material';

import { Wallet, Coin } from '../../models/AppSettings';
import { EditWalletDialog } from '../dialogs/EditWalletDialog';
import { RemoveWalletDialog } from '../dialogs/RemoveWalletDialog';

interface EditWalletControlsState {
  editOpen: boolean;
  removeOpen: boolean;
}

interface EditWalletControlsProps {
  wallet: Wallet;
  existingWallets: Wallet[];
  coins: Coin[];
  onEditSave: (wallet: Wallet) => void;
  onRemoveConfirm: (id: string) => void;
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

  handleRemoveWallet = (id: string) => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onRemoveConfirm(id);
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
        <RemoveWalletDialog open={removeOpen} id={wallet.id} coins={usedCoins} onCancel={this.handleCancelRemoveWallet} onRemove={this.handleRemoveWallet} />
        <DeleteIcon onClick={this.handleOpenRemoveDialog} />
        <EditIcon onClick={this.handleOpenEditDialog} />
      </Stack>
    );
  }
}
