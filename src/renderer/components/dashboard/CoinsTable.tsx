import { Button, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Tooltip, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { LinearProgressWithLabel } from '..';
import * as formatter from '../../services/Formatters';
import { ConfiguredCoin } from '../../../models';
import { unmineableApi } from '../../../shared/UnmineableApi';

type CoinsTableProps = {
  coins: ConfiguredCoin[];
  setCurrent: (coin: string) => void;
};

type CurrentIndicatorProps = {
  current: boolean;
  onClick: () => void;
};

async function openBrowser(coin: string, address: string) {
  await unmineableApi.openBrowser(coin, address);
}

function CurrentIndicator(props: CurrentIndicatorProps) {
  const { current, onClick } = props;

  if (current) {
    return <CheckIcon />;
  }

  return (
    <Tooltip title="Mine now">
      <IconButton onClick={onClick}>
        <PlayArrowIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
}

export function CoinsTable(props: CoinsTableProps) {
  const { coins, setCurrent } = props;

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
                  <CurrentIndicator current={c.current} onClick={() => setCurrent(c.symbol)} />
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
