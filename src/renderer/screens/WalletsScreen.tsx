import React from 'react';
import { v4 as uuid } from 'uuid';

import { Button, Container, TableContainer, TableCell, TableHead, TableRow, TableBody, Box, Paper, Table } from '@mui/material';

import { Wallet, Coin } from '../../models/Configuration';
import { ScreenHeader } from '../components/ScreenHeader';
import { EditWalletDialog } from '../dialogs/EditWalletDialog';
import { AppSettingsService } from '../services/AppSettingsService';
import { EditWalletControls } from '../components/EditWalletControls';

interface WalletsScreenState {
  coins: Coin[];
  newWallet: Wallet;
  wallets: Wallet[];
  isEditingNew: boolean;
}

interface WalletsScreenProps {
  appSettingsService: AppSettingsService;
}

const getEmptyWallet = (): Wallet => {
  return { id: uuid(), name: '', blockchain: 'ETH', address: '', memo: '' };
};

export class WalletsScreen extends React.Component<WalletsScreenProps, WalletsScreenState> {
  constructor(props: WalletsScreenProps) {
    super(props);

    this.state = {
      coins: [],
      newWallet: getEmptyWallet(),
      wallets: [],
      isEditingNew: false,
    };
  }

  async componentDidMount() {
    const { appSettingsService } = this.props;

    this.setState({
      coins: await appSettingsService.getCoins(),
      wallets: await appSettingsService.getWallets(),
    });
  }

  handleOnRemoveWalletConfirm = async (id: string) => {
    const { appSettingsService } = this.props;
    const { wallets } = this.state;

    if (id !== '') {
      const updatedWallets = [...wallets.filter((w) => w.id !== id)];

      await appSettingsService.setWallets(updatedWallets);

      this.setState({
        wallets: updatedWallets,
      });
    }
  };

  handleOnAddWalletSave = async (wallet: Wallet) => {
    const { appSettingsService } = this.props;
    const { wallets } = this.state;
    const updatedWallets = wallets.concat(wallet);

    await appSettingsService.setWallets(updatedWallets);

    this.setState({
      isEditingNew: false,
      wallets: updatedWallets,
    });
  };

  handleOnAddWalletCancel = () => {
    this.setState({
      isEditingNew: false,
    });
  };

  handleOnEditWalletSave = async (wallet: Wallet) => {
    const { appSettingsService } = this.props;
    const { wallets } = this.state;
    const index = wallets.findIndex((w) => w.id === wallet.id);
    const updatedWallets = [...wallets];

    updatedWallets.splice(index, 1);
    updatedWallets.splice(index, 0, wallet);

    await appSettingsService.setWallets(updatedWallets);

    this.setState({
      wallets: updatedWallets,
    });
  };

  addWallet = () => {
    this.setState({
      newWallet: getEmptyWallet(),
      isEditingNew: true,
    });
  };

  render() {
    const { newWallet, wallets, isEditingNew, coins } = this.state;

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
                      <EditWalletControls wallet={w} existingWallets={wallets} coins={coins} onEditSave={this.handleOnEditWalletSave} onRemoveConfirm={this.handleOnRemoveWalletConfirm} />
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
