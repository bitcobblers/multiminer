import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Typography } from '@mui/material';
// import * as formatter from '../../services/Formatters';
import { minerStatistics$ } from '../../services/StatisticsAggregator';
import { useObservableState } from '../../hooks';

export function CpuSummaryTable() {
  const [miner] = useObservableState(minerStatistics$, null);
  // const { hashrate, accepted, rejected, power, efficiency, difficulty, uptime } = miner ?? {};

  if (miner === null || Object.values(miner).find((x) => x !== undefined) === undefined) {
    return <Typography>No data to display!</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hashrate</TableCell>
            <TableCell>Accepted</TableCell>
            <TableCell>Rejected</TableCell>
            <TableCell>Cores</TableCell>
            <TableCell>Threads</TableCell>
            <TableCell>Algorithm</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Uptime</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
