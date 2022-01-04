import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Button, Container, Stack, TableContainer, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';

import { Wallet } from '../../models/Wallet';
import { ScreenHeader } from '../components/ScreenHeader';
import { RemoveWalletsConfirmationDialog } from '../components/RemoveWalletsConfirmationDialog';
import { EditWalletDialog } from '../components/EditWalletDialog';
import { AppSettingsService } from '../services/AppSettingsService';

type WalletRecord = Wallet & {
  id: number;
};

interface WalletsScreenState {
  newWallet: Wallet;
  wallets: WalletRecord[];
  deletedWalletId: number;
  isDeleteConfirmationOpen: boolean;
  isEditingNew: boolean;
  openEditor: number;
}

interface WalletsScreenProps {
  appSettingsService: AppSettingsService;
}

export class WalletsScreen extends React.Component<WalletsScreenProps, WalletsScreenState> {
  constructor(props: WalletsScreenProps) {
    super(props);

    this.state = {
      newWallet: this.getEmptyWallet(),
      wallets: [],
      deletedWalletId: 0,
      isDeleteConfirmationOpen: false,
      isEditingNew: false,
      openEditor: -1,
    };
  }

  async componentDidMount() {
    const { appSettingsService } = this.props;
    const wallets = await appSettingsService.getWallets();

    this.setState({
      wallets: this.remapWallets(wallets),
    });
  }

  handleOnRemoveWalletClose = (result: boolean) => {
    const { wallets, deletedWalletId } = this.state;

    if (result === true) {
      this.setState({
        isDeleteConfirmationOpen: false,
        wallets: [...wallets.filter((w) => w.id !== deletedWalletId)],
      });
    } else {
      this.setState({
        isDeleteConfirmationOpen: false,
      });
    }
  };

  handleOnAddWalletSave = (wallet: Wallet) => {
    const { wallets } = this.state;

    this.setState({
      isEditingNew: false,
      wallets: this.remapWallets([...wallets, wallet]),
    });
  };

  handleOnAddWalletCancel = () => {
    this.setState({
      isEditingNew: false,
    });
  };

  handleOnEditWalletSave = (id: number, wallet: Wallet) => {
    const { wallets } = this.state;
    const index = wallets.findIndex((w) => w.id === id);
    const updatedWallet = { ...wallet, ...{ id } };
    const updatedWallets = [...wallets];

    updatedWallets.splice(index, 1);
    updatedWallets.splice(index, 0, updatedWallet);

    this.setState({
      wallets: updatedWallets,
      openEditor: -1,
    });
  };

  handleOnEditWalletCancel = () => {
    this.setState({
      openEditor: -1,
    });
  };

  remapWallets = (wallets: Wallet[]) => {
    let offset = 1;

    const updatedWallets = wallets.map((w) => {
      // eslint-disable-next-line no-plusplus
      const meta = { id: offset++, isEditing: false };
      return { ...w, ...meta };
    });

    return updatedWallets;
  };

  addWallet = () => {
    this.setState({
      newWallet: this.getEmptyWallet(),
      isEditingNew: true,
    });
  };

  editWallet = (id: number) => {
    this.setState({
      openEditor: id,
    });
  };

  deleteWallet = (id: number) => {
    this.setState({
      deletedWalletId: id,
      isDeleteConfirmationOpen: true,
    });
  };

  getEmptyWallet = () => {
    return { id: 0, name: '', network: 'ETH', address: '', memo: '' } as Wallet;
  };

  // eslint-disable-next-line react/destructuring-assignment
  getOpenEditor = (id: number) => this.state.openEditor === id;

  render() {
    const { isDeleteConfirmationOpen, newWallet, wallets, isEditingNew } = this.state;

    return (
      <Container>
        <ScreenHeader title="Wallets" />
        <Button onClick={this.addWallet}>Add Wallet</Button>
        <Box
          sx={{
            '& .MuiDataGrid-cell--editing': {
              bgcolor: 'rgb(255,215,115, 0.19)',
              color: '#1a3e72',
            },
            '& .Mui-error': {
              bgcolor: (theme) => `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
              color: (theme) => (theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f'),
            },
          }}
        >
          <RemoveWalletsConfirmationDialog open={isDeleteConfirmationOpen} onClose={this.handleOnRemoveWalletClose} />
          <EditWalletDialog key="edit-wallet-0" open={isEditingNew} onSave={this.handleOnAddWalletSave} onCancel={this.handleOnAddWalletCancel} wallet={newWallet} isNew existingWallets={wallets} />
          {wallets.map((w) => (
            <EditWalletDialog
              key={`edit-wallet-${w.id}`}
              open={this.getOpenEditor(w.id)}
              onSave={(updatedWallet) => this.handleOnEditWalletSave(w.id, updatedWallet)}
              onCancel={this.handleOnEditWalletCancel}
              wallet={w}
              isNew={false}
              existingWallets={wallets}
            />
          ))}
          <TableContainer component={Paper}>
            <Table aria-label="Wallets">
              <TableHead>
                <TableRow>
                  <TableCell width="80px" />
                  <TableCell width="15%">Name</TableCell>
                  <TableCell width="10%">Network</TableCell>
                  <TableCell width="60%">Address</TableCell>
                  <TableCell width="15%">Memo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wallets.map((w) => (
                  <TableRow key={w.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <DeleteIcon onClick={() => this.deleteWallet(w.id)} />
                        <EditIcon onClick={() => this.editWallet(w.id)} />
                      </Stack>
                    </TableCell>
                    <TableCell>{w.name}</TableCell>
                    <TableCell>{w.network}</TableCell>
                    <TableCell>{w.address}</TableCell>
                    <TableCell>{w.memo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    );
  }
}
