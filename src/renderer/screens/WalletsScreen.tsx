import React from 'react';
import { v4 as uuid } from 'uuid';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Container, Stack, TableContainer, TableCell, TableHead, TableRow, TableBody, Box, Paper, Table } from '@mui/material';

import { Wallet, Coin } from '../../models/Configuration';
import { ScreenHeader } from '../components/ScreenHeader';
import { RemoveWalletsConfirmationDialog } from '../components/RemoveWalletsConfirmationDialog';
import { EditWalletDialog } from '../components/EditWalletDialog';
import { AppSettingsService } from '../services/AppSettingsService';

interface WalletsScreenState {
  coins: Coin[];
  newWallet: Wallet;
  wallets: Wallet[];
  deletedWalletId: string;
  isDeleteConfirmationOpen: boolean;
  isEditingNew: boolean;
  openEditor: string;
}

interface WalletsScreenProps {
  appSettingsService: AppSettingsService;
}

export class WalletsScreen extends React.Component<WalletsScreenProps, WalletsScreenState> {
  constructor(props: WalletsScreenProps) {
    super(props);

    this.state = {
      coins: [],
      newWallet: this.getEmptyWallet(),
      wallets: [],
      deletedWalletId: '',
      isDeleteConfirmationOpen: false,
      isEditingNew: false,
      openEditor: '',
    };
  }

  async componentDidMount() {
    const { appSettingsService } = this.props;

    this.setState({
      coins: await appSettingsService.getCoins(),
      wallets: await appSettingsService.getWallets(),
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
      wallets: wallets.concat(wallet),
    });
  };

  handleOnAddWalletCancel = () => {
    this.setState({
      isEditingNew: false,
    });
  };

  handleOnEditWalletSave = (wallet: Wallet) => {
    const { wallets } = this.state;
    const index = wallets.findIndex((w) => w.id === wallet.id);
    const updatedWallets = [...wallets];

    updatedWallets.splice(index, 1);
    updatedWallets.splice(index, 0, wallet);

    this.setState({
      wallets: updatedWallets,
      openEditor: '',
    });
  };

  handleOnEditWalletCancel = () => {
    this.setState({
      openEditor: '',
    });
  };

  addWallet = () => {
    this.setState({
      newWallet: this.getEmptyWallet(),
      isEditingNew: true,
    });
  };

  editWallet = (id: string) => {
    this.setState({
      openEditor: id,
    });
  };

  deleteWallet = (id: string) => {
    this.setState({
      deletedWalletId: id,
      isDeleteConfirmationOpen: true,
    });
  };

  getEmptyWallet = () => {
    return { id: uuid(), name: '', blockchain: 'ETH', address: '', memo: '' } as Wallet;
  };

  // eslint-disable-next-line react/destructuring-assignment
  getOpenEditor = (id: string) => this.state.openEditor === id;

  render() {
    const { isDeleteConfirmationOpen, newWallet, wallets, isEditingNew, coins } = this.state;

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
          <EditWalletDialog
            key="edit-new-wallet"
            open={isEditingNew}
            onSave={this.handleOnAddWalletSave}
            onCancel={this.handleOnAddWalletCancel}
            wallet={newWallet}
            isNew
            existingWallets={wallets}
            coins={[]}
          />
          {wallets.map((w) => (
            <EditWalletDialog
              key={`edit-wallet-${w.id}`}
              open={this.getOpenEditor(w.id)}
              onSave={this.handleOnEditWalletSave}
              onCancel={this.handleOnEditWalletCancel}
              wallet={w}
              isNew={false}
              existingWallets={wallets}
              coins={coins.filter((c) => c.wallet === w.name)}
            />
          ))}
          <TableContainer component={Paper}>
            <Table aria-label="Wallets">
              <TableHead>
                <TableRow>
                  <TableCell width="80px" />
                  <TableCell width="15%">Name</TableCell>
                  <TableCell width="10%">Blockchain</TableCell>
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
                    <TableCell>{w.blockchain}</TableCell>
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
