import React from 'react';

import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

import { Wallet } from '../../models/Wallet';
import { ScreenHeader } from '../components/ScreenHeader';
import { RemoveWalletsConfirmationDialog } from '../components/RemoveWalletsConfirmationDialog';

import { AppSettingsService } from '../services/AppSettingsService';

interface WalletsScreenState {
  idCounter: number;
  wallets: Wallet[];
  selectedWallets: Wallet[];
  numSelectedWallets: number;
  isDeleteDisabled: boolean;
  isDeleteConfirmationOpen: boolean;
}

interface WalletsScreenProps {
  appSettingsService: AppSettingsService;
}

export class WalletsScreen extends React.Component<WalletsScreenProps, WalletsScreenState> {
  static isNotEmpty(value: string) {
    return value.trim() !== '';
  }

  constructor(props: WalletsScreenProps) {
    super(props);

    this.state = {
      idCounter: 0,
      wallets: [],
      selectedWallets: [],
      numSelectedWallets: 0,
      isDeleteDisabled: true,
      isDeleteConfirmationOpen: false,
    };
  }

  async componentDidMount() {
    const { appSettingsService } = this.props;

    this.setState({
      wallets: await appSettingsService.getWallets(),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getColumns(): GridColDef[] {
    return [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        editable: true,
        sortable: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preProcessEditCellProps: (params: any) => {
          const { value } = params.props;
          const isValid = WalletsScreen.isNotEmpty(value as string);

          return { ...params.props, error: !isValid };
        },
      },
      {
        field: 'network',
        headerName: 'Network',
        flex: 1,
        editable: true,
        sortable: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preProcessEditCellProps: (params: any) => {
          const { value } = params.props;
          const isValid = WalletsScreen.isNotEmpty(value as string);
          return { ...params.props, error: !isValid };
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
          const { value } = params.props;
          const isValid = WalletsScreen.isNotEmpty(value as string);
          return { ...params.props, error: !isValid };
        },
      },
      {
        field: 'memo',
        headerName: 'Memo',
        flex: 2,
        editable: true,
        sortable: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        preProcessEditCellProps: (params: any) => {
          return { ...params.props, error: false };
        },
      },
    ];
  }

  addWallet = () => {
    const { idCounter, wallets } = this.state;

    const newWallet: Wallet = {
      id: idCounter,
      name: this.generateWalletName(),
      network: 'ETH',
      address: '',
      memo: '',
    };

    this.setState({
      idCounter: idCounter + 1,
      wallets: [...wallets].concat(newWallet),
    });
  };

  deleteWallets = () => {
    this.setState({
      isDeleteConfirmationOpen: true,
    });
  };

  generateWalletName = () => {
    const { wallets } = this.state;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSelectionModelChange = (model: number[] | any[]) => {
    const { wallets } = this.state;

    this.setState({
      selectedWallets: [...wallets.filter((w: Wallet) => (model as number[]).filter((id) => id === w.id).length > 0)],
      numSelectedWallets: model.length,
      isDeleteDisabled: model.length < 1,
    });
  };

  handleOnClose = (result: boolean) => {
    const { wallets, selectedWallets } = this.state;

    this.setState({
      isDeleteConfirmationOpen: false,
    });

    if (result === true) {
      setTimeout(() => {
        this.setState({
          wallets: [...wallets.filter((w: Wallet) => selectedWallets.filter((sw: Wallet) => sw.id === w.id).length < 1)],
        });
      });
    }
  };

  render() {
    const { isDeleteDisabled, isDeleteConfirmationOpen, numSelectedWallets, wallets } = this.state;
    return (
      <Container>
        <ScreenHeader title="Wallets" />
        <Button onClick={this.addWallet}>Add Wallet</Button>
        <Button onClick={this.deleteWallets} disabled={isDeleteDisabled}>
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
          <RemoveWalletsConfirmationDialog open={isDeleteConfirmationOpen} onClose={this.handleOnClose} numSelectedWallets={numSelectedWallets} />
          <DataGrid rows={wallets} columns={this.getColumns()} autoHeight hideFooter checkboxSelection onSelectionModelChange={this.handleSelectionModelChange} />
        </Box>
      </Container>
    );
  }
}
