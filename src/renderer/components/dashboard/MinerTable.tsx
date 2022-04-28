import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import { MinerStatistic } from '../../../models';
import * as formatter from '../../services/Formatters';

export function MinerTable(props: { miner: MinerStatistic }) {
  const { miner } = props;
  const { hashrate, accepted, rejected, power, efficiency, difficulty, uptime } = miner;

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
