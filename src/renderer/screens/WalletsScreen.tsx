import { useState } from 'react';

import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import { Wallet } from '../../models/Wallet';
import { ScreenHeader } from '../components/ScreenHeader';
import { RemoveWalletsConfirmationDialog } from '../components/RemoveWalletsConfirmationDialog';

const data: Wallet[] = [
  { id: 0, name: 'mywallet1', network: 'ETH', address: '12345', memo: '' },
  { id: 1, name: 'mywallet2', network: 'BSC', address: '54321', memo: '' },
];

export function WalletsScreen() {
  const [idCounter, setIdCounter] = useState(data.length);
  const [wallets, setWallets] = useState(data);
  const [selectedWallets, setSelectedWallets] = useState([] as Wallet[]);
  const [numSelectedWallets, setNumSelectedWallets] = useState(0);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const isNotEmpty = (value: string) => value.trim() !== '';

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      editable: true,
      sortable: true,
      preProcessEditCellProps: (params) => {
        const { value } = params.props;
        const isValid = isNotEmpty(value as string);
        return { ...params.props, error: !isValid };
      },
    },
    {
      field: 'network',
      headerName: 'Network',
      flex: 1,
      editable: true,
      sortable: true,
      preProcessEditCellProps: (params) => {
        const { value } = params.props;
        const isValid = isNotEmpty(value as string);
        return { ...params.props, error: !isValid };
      },
      // renderEditCell: (params) => {
      //   let { value } = params;

      //   const handleChange = (event: unknown, child: { props: { value: string | number | boolean | object | Date | null | undefined } }) => {
      //     value = child.props.value;
      //   };

      //   return (
      //     <Select id="select-network" label="Network" value={value} sx={{ width: '100%' }} onChange={handleChange}>
      //       <MenuItem value="ETH">ETH</MenuItem>
      //       <MenuItem value="BSC">BSC</MenuItem>
      //       <MenuItem value="TRX">TRX</MenuItem>
      //     </Select>
      //   );
      // },
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 7,
      editable: true,
      sortable: true,
      preProcessEditCellProps: (params) => {
        const { value } = params.props;
        const isValid = isNotEmpty(value as string);
        return { ...params.props, error: !isValid };
      },
    },
    {
      field: 'memo',
      headerName: 'Memo',
      flex: 2,
      editable: true,
      sortable: false,
      preProcessEditCellProps: (params) => {
        return { ...params.props, error: false };
      },
    },
  ];

  const generateWalletName = () => {
    const baseName = 'new wallet';
    let index = 1;

    do {
      const newName = baseName + index;
      index += 1;

      if (wallets.find((w) => w.name === newName) === undefined) {
        return newName;
      }

      // eslint-disable-next-line no-constant-condition
    } while (true);
  };

  const addWallet = () => {
    const newWallet: Wallet = {
      id: idCounter,
      name: generateWalletName(),
      network: 'ETH',
      address: '',
      memo: '',
    };

    setIdCounter(idCounter + 1);
    setWallets([...wallets].concat(newWallet));
  };

  const deleteWallets = () => setIsDeleteConfirmationOpen(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionModelChange = (model: number[] | any[]) => {
    setSelectedWallets([...wallets.filter((w: Wallet) => (model as number[]).filter((id) => id === w.id).length > 0)]);
    setNumSelectedWallets(model.length);
    setIsDeleteDisabled(model.length < 1);
  };

  const handleOnClose = (result: boolean) => {
    setIsDeleteConfirmationOpen(false);

    if (result === true) {
      setTimeout(() => {
        setWallets([...wallets.filter((w: Wallet) => selectedWallets.filter((sw: Wallet) => sw.id === w.id).length < 1)]);
      });
    }
  };

  return (
    <Container>
      <ScreenHeader title="Wallets" />
      <Button onClick={addWallet}>Add Wallet</Button>
      <Button onClick={deleteWallets} disabled={isDeleteDisabled}>
        Delete
      </Button>
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
        <RemoveWalletsConfirmationDialog open={isDeleteConfirmationOpen} onClose={handleOnClose} numSelectedWallets={numSelectedWallets} />
        <DataGrid rows={wallets} columns={columns} autoHeight hideFooter checkboxSelection onSelectionModelChange={handleSelectionModelChange} />
      </Box>
    </Container>
  );
}
