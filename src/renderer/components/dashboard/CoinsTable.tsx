import { Button, Table, TableContainer, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { LinearProgressWithLabel } from '..';
import * as formatter from '../../services/Formatters';
import { ConfiguredCoin } from '../../../models';
import { unmineableApi } from '../../../shared/UnmineableApi';

function progress(mined: number | undefined, threshold: number | undefined) {
  return mined === undefined || threshold === undefined || mined === 0 || threshold === 0 ? 0 : (100 * mined) / threshold;
}

async function openBrowser(coin: string, address: string) {
  await unmineableApi.openBrowser(coin, address);
}

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
              <TableCell>
                <Button onClick={async () => openBrowser(c.symbol, c.address)}>{c.symbol}</Button>
              </TableCell>
              <TableCell>{formatter.number(c.mined, 6)}</TableCell>
              <TableCell>{formatter.currency(c.price, 8)}</TableCell>
              <TableCell>{formatter.minedValue(c.price, c.mined)}</TableCell>
              <TableCell>{formatter.number(c.threshold)}</TableCell>
              <TableCell>
                <LinearProgressWithLabel value={progress(c.mined, c.threshold)} />
              </TableCell>
              <TableCell>{`${c.duration.toLocaleString()} hours`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
