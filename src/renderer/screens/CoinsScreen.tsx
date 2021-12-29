import { Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';

// Components.
import { AllCoins } from '../../models/Coins';
import { ScreenHeader } from '../components/ScreenHeader';

const columns: GridColDef[] = [
  {
    field: 'icon',
    headerName: '',
    width: 60,
    editable: false,
    sortable: false,
    renderCell: (params) => {
      const { value } = params;
      return <img src={value} alt="unknown" />;
    },
  },
  {
    field: 'symbol',
    headerName: 'Symbol',
    width: 120,
    editable: false,
    sortable: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    editable: false,
    sortable: true,
  },
  {
    field: 'networks',
    headerName: 'Networks',
    flex: 1,
    editable: false,
    sortable: true,
    renderCell: (params) => {
      const { value } = params;

      if (value.length === 0) {
        return <></>;
      }

      return (
        <div>
          {value.map((n: string) => (
            <Chip id={n} label={n} />
          ))}
        </div>
      );
    },
  },
  {
    field: 'referral',
    headerName: 'Referral',
    flex: 3,
    editable: true,
    sortable: false,
  },
];

export function CoinsScreen(): JSX.Element {
  return (
    <Container>
      <ScreenHeader title="Coins" />
      <DataGrid rows={AllCoins} columns={columns} autoHeight />
    </Container>
  );
}
