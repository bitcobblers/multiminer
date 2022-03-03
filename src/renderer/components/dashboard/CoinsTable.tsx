import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import * as formatter from '../../services/Formatters';
import { ConfiguredCoin } from '../../../models';

export function CoinsTable(props: { coins: ConfiguredCoin[] }) {
  const { coins } = props;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Current</TableCell>
            <TableCell>Icon</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Mined</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Threshold</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((c) => (
            <TableRow key={c.symbol}>
              <TableCell>{c.current ? <CheckIcon /> : <></>} </TableCell>
              <TableCell>
                <img src={c.icon} alt="icon" />
              </TableCell>
              <TableCell>{c.symbol}</TableCell>
              <TableCell>{formatter.number(c.mined)}</TableCell>
              <TableCell>{formatter.currency(c.price)}</TableCell>
              <TableCell>{formatter.minedValue(c.price, c.mined)}</TableCell>
              <TableCell>{formatter.number(c.threshold)}</TableCell>
              <TableCell>{formatter.progress(c.mined, c.threshold)}</TableCell>
              <TableCell>{`${c.duration.toLocaleString()} hours`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}