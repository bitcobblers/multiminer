import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Typography } from '@mui/material';
// import * as formatter from '../../services/Formatters';
import { gpuStatistics$ } from '../../services/StatisticsAggregator';
import { useObservableState } from '../../hooks';

export function CpuComputeTable() {
  const [gpus] = useObservableState(gpuStatistics$, []);

  if (gpus.length === 0) {
    return <Typography>No data to display!</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow />
        </TableHead>
        <TableBody>
          {gpus.map((gpu) => (
            <TableRow key={gpu.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
