import { useState } from 'react';

import { Button, Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

import { ScreenHeader } from '../components/ScreenHeader';

type Wallet = {
  id: number;
  name: string;
  network: string;
  address: string;
};

const data: Wallet[] = [
  { id: 0, name: 'mywallet1', network: 'ETH', address: '12345' },
  { id: 1, name: 'mywallet2', network: 'BTC,TRC', address: '54321' },
];

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    editable: true,
    sortable: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preProcessEditCellProps: (params: any) => {
      const value = params.props.value.trim();
      const isEmpty = value.length === 0;

      return { ...params.props, error: isEmpty };
    },
  },
  {
    field: 'network',
    headerName: 'Network',
    flex: 2,
    editable: true,
    sortable: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell: (params: any) => {
      const networkRaw: string = params.value.trim();

      if (networkRaw === '') {
        return <div />;
      }

      const networks = networkRaw.split(/[\s,;]+/).filter((n) => n.length > 0);

      return (
        <div>
          {networks.map((n) => {
            return <Chip key={n} label={n.toUpperCase()} variant="outlined" />;
          })}
        </div>
      );
    },
  },
  {
    field: 'address',
    headerName: 'Address',
    flex: 7,
    editable: true,
    sortable: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preProcessEditCellProps: (params: any) => {
      const isEmpty = params.props.value.trim().length === 0;
      return { ...params.props, error: isEmpty };
    },
  },
];

export function WalletsScreen() {
  const [idCounter, setIdCounter] = useState(data.length);
  const [wallets, setWallets] = useState(data);
  const [selectedWallets, setSelectedWallets] = useState([] as Wallet[]);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);

  const addWallet = () => {
    const newWallet: Wallet = {
      id: idCounter,
      name: 'new wallet',
      network: '',
      address: '',
    };

    setIdCounter(idCounter + 1);
    setWallets([...wallets].concat(newWallet));
  };

  const deleteWallets = () => {
    setTimeout(() => {
      setWallets([...wallets.filter((w: Wallet) => selectedWallets.filter((sw: Wallet) => sw.id === w.id).length < 1)]);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionModelChange = (model: any) => {
    setSelectedWallets([...wallets.filter((w: Wallet) => (model as number[]).filter((id) => id === w.id).length > 0)]);
    setIsDeleteDisabled(model.length < 1);
  };

  return (
    <Container>
      <ScreenHeader title="Wallets" />
      <Button onClick={addWallet}>Add Wallet</Button>
      <Button onClick={deleteWallets} disabled={isDeleteDisabled}>
        Delete
      </Button>
      <DataGrid rows={wallets} columns={columns} autoHeight hideFooter checkboxSelection onSelectionModelChange={handleSelectionModelChange} />
    </Container>
  );
}
