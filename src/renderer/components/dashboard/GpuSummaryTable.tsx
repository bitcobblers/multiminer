import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Typography } from '@mui/material';
import * as formatter from '../../services/Formatters';
import { minerStatistics$ } from '../../services/StatisticsAggregator';
import { useObservableState } from '../../hooks';

export function GpuSummaryTable() {
  const [miner] = useObservableState(minerStatistics$, null);
  const { hashrate, accepted, rejected, power, efficiency, difficulty, uptime } = miner ?? {};

  if (miner === null || Object.values(miner).find((x) => x !== undefined) === undefined) {
    return <Typography>No data to display!</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hashrate</TableCell>
            <TableCell>Found</TableCell>
            <TableCell>Shares</TableCell>
            <TableCell>Power</TableCell>
            <TableCell>Efficiency</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Uptime</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{formatter.hashrate(hashrate)}</TableCell>
            <TableCell>{formatter.found(accepted, rejected)}</TableCell>
            <TableCell>{formatter.shares(accepted, rejected)}</TableCell>
            <TableCell>{formatter.power(power)}</TableCell>
            <TableCell>{formatter.efficiency(efficiency)}</TableCell>
            <TableCell>{formatter.difficulty(difficulty)}</TableCell>
            <TableCell>{formatter.uptime(uptime)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
