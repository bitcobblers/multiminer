import { Button, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Tooltip, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { LinearProgressWithLabel } from '..';
import * as formatter from '../../services/Formatters';
import { enabledCoins$ } from '../../../models';
import { unmineableApi } from '../../../shared/UnmineableApi';
import { useObservableState } from '../../hooks';

type CoinsTableProps = {
  setCurrent: (coin: string) => void;
  stopCurrent: () => void;
};

type CurrentIndicatorProps = {
  current: boolean;
  onStart: () => void;
  onStop: () => void;
};

async function openBrowser(coin: string, address: string) {
  await unmineableApi.openBrowser(coin, address);
}

function CurrentIndicator(props: CurrentIndicatorProps) {
  const { current, onStart, onStop } = props;

  if (current) {
    return (
      <Tooltip title="Stop mining">
        <IconButton onClick={onStop}>
          <StopIcon color="error" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Mine now">
      <IconButton onClick={onStart}>
        <PlayArrowIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
}

export function CoinsTable(props: CoinsTableProps) {
  const { setCurrent, stopCurrent } = props;
  const [coins] = useObservableState(enabledCoins$, []);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Coin</TableCell>
            <TableCell>Mined</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Threshold</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins
            .sort((a, b) => a.symbol.localeCompare(b.symbol))
            .map((c) => (
              <TableRow key={c.symbol}>
                <TableCell>
                  <CurrentIndicator current={c.current} onStart={() => setCurrent(c.symbol)} onStop={() => stopCurrent()} />
                </TableCell>
                <TableCell>
                  <Button onClick={async () => openBrowser(c.symbol, c.address)} sx={{ minWidth: '5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={c.icon} alt="icon" style={{ height: '1.5rem', marginRight: '0.5rem' }} />
                      {c.symbol}
                    </div>
                  </Button>
                </TableCell>
                <TableCell>{formatter.number(c.mined, 6)}</TableCell>
                <TableCell>{formatter.currency(c.price, 8)}</TableCell>
                <TableCell>{formatter.minedValue(c.price, c.mined)}</TableCell>
                <TableCell>{formatter.number(c.threshold)}</TableCell>
                <TableCell>
                  <LinearProgressWithLabel value={formatter.progress(c.mined, c.threshold)} />
                </TableCell>
                <TableCell>{formatter.duration(c.duration)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
