import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Typography } from '@mui/material';
import * as formatter from '../../services/Formatters';
import { gpuStatistics$ } from '../../services/StatisticsAggregator';
import { useObservableState } from '../../hooks';

export function GpuComputeTable() {
  const [gpus] = useObservableState(gpuStatistics$, []);

  if (gpus.length === 0) {
    return <Typography>No data to display!</Typography>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Hashrate</TableCell>
            <TableCell>Shares</TableCell>
            <TableCell>Power</TableCell>
            <TableCell>Efficiency</TableCell>
            <TableCell>Core Clock</TableCell>
            <TableCell>Memory Clock</TableCell>
            <TableCell>Core Temp</TableCell>
            <TableCell>Memory Temp</TableCell>
            <TableCell>Fan Speed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gpus.map((gpu) => (
            <TableRow key={gpu.id}>
              <TableCell>{gpu.id}</TableCell>
              <TableCell>{gpu.name}</TableCell>
              <TableCell>{formatter.hashrate(gpu.hashrate)}</TableCell>
              <TableCell>{formatter.shares(gpu.accepted, gpu.rejected)}</TableCell>
              <TableCell>{formatter.power(gpu.power)}</TableCell>
              <TableCell>{formatter.efficiency(gpu.efficiency)}</TableCell>
              <TableCell>{formatter.clockSpeed(gpu.coreClock)}</TableCell>
              <TableCell>{formatter.clockSpeed(gpu.memClock)}</TableCell>
              <TableCell>{formatter.temperature(gpu.coreTemperature)}</TableCell>
              <TableCell>{formatter.temperature(gpu.memTemperature)}</TableCell>
              <TableCell>{formatter.percentage(gpu.fanSpeed)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
