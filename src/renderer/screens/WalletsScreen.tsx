import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Button, Container, Divider, Stack, TableContainer, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';

import { Wallet } from '../../models/Wallet';
import { ScreenHeader } from '../components/ScreenHeader';
import { RemoveWalletsConfirmationDialog } from '../components/RemoveWalletsConfirmationDialog';
import { EditWalletDialog } from '../components/EditWalletDialog';
import { AppSettingsService } from '../services/AppSettingsService';

type WalletRecord = Wallet & { id: number };

interface WalletsScreenState {
  currentWallet: WalletRecord;
  isCurrentWalletNew: boolean;
  wallets: WalletRecord[];
  isDeleteConfirmationOpen: boolean;
  isEditDialogOpen: boolean;
}

interface WalletsScreenProps {
  appSettingsService: AppSettingsService;
}

export class WalletsScreen extends React.Component<WalletsScreenProps, WalletsScreenState> {
  constructor(props: WalletsScreenProps) {
    super(props);

    this.state = {
      currentWallet: this.emptyWallet(),
      isCurrentWalletNew: true,
      wallets: [],
      isDeleteConfirmationOpen: false,
      isEditDialogOpen: false,
    };
  }

  async componentDidMount() {
    const { appSettingsService } = this.props;
    this.remapWallets(await appSettingsService.getWallets());
  }

  handleOnRemoveWalletClose = (result: boolean) => {
    const { wallets, currentWallet } = this.state;

    if (result === true) {
      this.setState({
        isDeleteConfirmationOpen: false,
        wallets: [...wallets.filter((w) => w.id !== currentWallet.id)],
      });
    } else {
      this.setState({
        isDeleteConfirmationOpen: false,
      });
    }
  };

  handleOnEditWalletClose = (result: boolean) => {
    const { wallets, currentWallet, isCurrentWalletNew } = this.state;

    this.setState({
      isEditDialogOpen: false,
    });

    if (result === false) {
      return;
    }

    if (isCurrentWalletNew === true) {
      this.remapWallets([...wallets, currentWallet]);
    }
  };

  handleOnEditWalletSave = (wallet: Wallet) => {
    const { wallets, currentWallet, isCurrentWalletNew } = this.state;
    const index = wallets.findIndex((w) => w.id === currentWallet.id);

    if (isCurrentWalletNew) {
      this.setState({
        isEditDialogOpen: false,
      });

      this.remapWallets([...wallets, wallet]);
    } else {
      const updatedCurrentWallet = { ...currentWallet, ...wallet };
      const updatedWallets = [...wallets];

      updatedWallets.splice(index, 1);
      updatedWallets.splice(index, 0, updatedCurrentWallet);

      this.setState({
        isEditDialogOpen: false,
        wallets: updatedWallets,
      });
    }
  };

  handleOnEditWalletCancel = () => {
    this.setState({
      isEditDialogOpen: false,
    });
  };

  remapWallets = (wallets: Wallet[]) => {
    let offset = 1;

    const updatedWallets = wallets.map((w) => {
      // eslint-disable-next-line no-plusplus
      const id = { id: offset++ };
      return { ...w, ...id };
    });

    this.setState({
      wallets: updatedWallets,
    });
  };

  emptyWallet = (): WalletRecord => {
    return { id: 0, name: '', network: 'ETH', address: '', memo: '' };
  };

  addWallet = () => {
    this.setState({
      currentWallet: this.emptyWallet(),
      isCurrentWalletNew: true,
      isEditDialogOpen: true,
    });
  };

  editWallet = (id: number) => {
    const { wallets } = this.state;

    this.setState({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      currentWallet: wallets.find((w) => w.id === id)!,
      isCurrentWalletNew: false,
      isEditDialogOpen: true,
    });
  };

  deleteWallet = (id: number) => {
    const { wallets } = this.state;

    this.setState({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      currentWallet: wallets.find((w) => w.id === id)!,
      isDeleteConfirmationOpen: true,
    });
  };

  render() {
    const { isDeleteConfirmationOpen, isEditDialogOpen, wallets, currentWallet, isCurrentWalletNew } = this.state;

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
            open={isEditDialogOpen}
            onSave={this.handleOnEditWalletSave}
            onCancel={this.handleOnEditWalletCancel}
            wallet={currentWallet}
            isNew={isCurrentWalletNew}
            existingWallets={wallets}
          />
          <Divider />
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
