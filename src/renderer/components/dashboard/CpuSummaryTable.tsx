import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Typography } from '@mui/material';
import * as formatter from '../../services/Formatters';
import { cpuStatistics$ } from '../../services/StatisticsAggregator';
import { useObservableState } from '../../hooks';

export function CpuSummaryTable() {
  const [cpu] = useObservableState(cpuStatistics$, null);
  // const { hashrate, accepted, rejected, power, efficiency, difficulty, uptime } = miner ?? {};
  const { hashrate, accepted, rejected, cores, threads, algorithm, difficulty, uptime } = cpu ?? { };

  if (cpu === null || Object.values(cpu).find((x) => x !== undefined) === undefined) {
    return <Typography>No data to display!</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hashrate (10s)</TableCell>
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
          <TableRow>
            <TableCell>{formatter.hashrate(hashrate, 'K')}</TableCell>
            <TableCell>{formatter.number(accepted)}</TableCell>
            <TableCell>{formatter.number(rejected)}</TableCell>
            <TableCell>{formatter.number(cores)}</TableCell>
            <TableCell>{formatter.number(threads)}</TableCell>
            <TableCell>{algorithm}</TableCell>
            <TableCell>{formatter.number(difficulty)}</TableCell>
            <TableCell>{formatter.uptime(uptime)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
