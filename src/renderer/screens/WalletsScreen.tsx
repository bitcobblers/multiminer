import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Button, Container, TableContainer, TableCell, TableHead, TableRow, TableBody, Box, Paper, Table } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';

import { Wallet, Coin } from '../../models';
import { ScreenHeader, EditWalletControls } from '../components';
import { EditWalletDialog } from '../dialogs/EditWalletDialog';
import * as config from '../services/AppSettingsService';
import { useLoadData } from '../hooks';

const getEmptyWallet = (): Wallet => ({ id: uuid(), name: '', network: 'ETH', address: '', memo: '' });

export function WalletsScreen() {
  const { enqueueSnackbar } = useSnackbar();
  const [coins, setCoins] = useState(Array<Coin>());
  const [newWallet, setNewWallet] = useState<Wallet>(getEmptyWallet());
  const [wallets, setWallets] = useState(Array<Wallet>());
  const [isEditingNew, setIsEditingNew] = useState(false);

  useLoadData(async (settings) => {
    setCoins(await settings.getCoins());
    setWallets(await settings.getWallets());
  });

  const handleOnRemoveWalletConfirm = async (name: string, id: string) => {
    if (id !== '') {
      const updatedWallets = [...wallets.filter((w) => w.id !== id)];
      setWallets(updatedWallets);
      await config.setWallets(updatedWallets);
      enqueueSnackbar(`Removed wallet ${name}.`, { variant: 'success' });
    }
  };

  const handleOnAddWalletSave = async (wallet: Wallet) => {
    const updatedWallets = wallets.concat(wallet);

    setIsEditingNew(false);
    setWallets(updatedWallets);
    await config.setWallets(updatedWallets);
    enqueueSnackbar(`Added wallet ${wallet.name}.`, { variant: 'success' });
  };

  const handleOnAddWalletCancel = () => {
    setIsEditingNew(false);
  };

  const handleOnEditWalletSave = async (wallet: Wallet) => {
    const index = wallets.findIndex((w) => w.id === wallet.id);
    const updatedWallets = [...wallets];

    updatedWallets.splice(index, 1);
    updatedWallets.splice(index, 0, wallet);

    await config.setWallets(updatedWallets);
    setWallets(updatedWallets);
    await config.setWallets(updatedWallets);
    enqueueSnackbar(`Updated wallet ${wallet.name}.`, { variant: 'success' });
  };

  const addWallet = () => {
    setNewWallet(getEmptyWallet());
    setIsEditingNew(true);
  };

  return (
    <Container>
      <ScreenHeader title="Wallets">
        <Button startIcon={<AddIcon />} onClick={addWallet}>
          Add Wallet
        </Button>
      </ScreenHeader>
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
        <EditWalletDialog key="edit-new-wallet" open={isEditingNew} onSave={handleOnAddWalletSave} onCancel={handleOnAddWalletCancel} wallet={newWallet} isNew existingWallets={wallets} coins={[]} />
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
                    <EditWalletControls wallet={w} existingWallets={wallets} coins={coins} onEditSave={handleOnEditWalletSave} onRemoveConfirm={handleOnRemoveWalletConfirm} />
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
