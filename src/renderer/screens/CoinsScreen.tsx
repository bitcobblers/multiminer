import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';

import CheckIcon from '@mui/icons-material/Check';
import { Container, TableContainer, TableCell, TableHead, TableRow, TableBody, Chip, Table, FormControlLabel, Switch, TextField, Box } from '@mui/material';
import { ALL_COINS, Coin, Wallet } from '../../models';
import { getCoins, setCoins, getWallets } from '../services/AppSettingsService';
import { ScreenHeader, EditCoinControls } from '../components';

type CoinRecord = {
  id: string;
  icon: string;
  name: string;
  blockchains: string[];
  isSet: boolean;
  coin: Coin;
};

const blankCoin = (symbol: string) => {
  return {
    symbol,
    wallet: null,
    enabled: false,
    duration: 6,
  };
};

async function loadCoins() {
  const loadedCoins = await getCoins();

  return ALL_COINS.sort((a, b) => a.symbol.localeCompare(b.symbol)).map((cd) => {
    const coin = loadedCoins.find((c) => c.symbol === cd.symbol);

    return {
      id: cd.id,
      icon: cd.icon,
      name: cd.name,
      blockchains: cd.blockchains,
      isSet: coin !== undefined,
      coin: coin ?? blankCoin(cd.symbol),
    };
  });
}

export function CoinsScreen() {
  const { enqueueSnackbar } = useSnackbar();

  const [wallets, setWallets] = useState<Array<Wallet>>([]);
  const [coins, setLoadedCoins] = useState<Array<CoinRecord>>([]);
  const [enabledOnly, setEnabledOnly] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const filteredCoins = useMemo(
    () =>
      coins
        .filter((c) => {
          const isOptionallyEnabled = enabledOnly ? c.coin.enabled : true;
          const isOptionallyFiltered = filter ? `${c.name} ${c.coin.symbol}`.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) : true;
          return isOptionallyEnabled && isOptionallyFiltered;
        })
        .sort((a, b) => a.coin.symbol.localeCompare(b.coin.symbol))
        .map((x) => x),
    [coins, enabledOnly, filter]
  );

  useEffect(() => {
    const readConfigAsync = async () => {
      setWallets(await getWallets());
      setLoadedCoins(await loadCoins());
    };

    readConfigAsync();
  }, []);

  const handleOnEditCoinSave = async (coin: Coin) => {
    await setCoins(
      coins
        .filter((c) => c.isSet && c.coin.symbol !== coin.symbol)
        .map((c) => c.coin)
        .concat(coin)
    );

    setLoadedCoins(await loadCoins());

    enqueueSnackbar(`Coin ${coin.symbol} updated.`, {
      variant: 'success',
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEnabledOnlyChange = (e: any) => {
    setEnabledOnly(e.target.checked);
  };

  return (
    <Container>
      <ScreenHeader title="Coins" />
      <Box sx={{ display: 'flex', mt: '1rem' }}>
        <TextField size="small" sx={{ mr: '1rem' }} placeholder="Filter..." onChange={(event) => setFilter(event.target.value)} />
        <FormControlLabel control={<Switch checked={enabledOnly} onChange={handleEnabledOnlyChange} />} label="Only Show Enabled" />
      </Box>
      <TableContainer>
        <Table aria-label="Coins">
          <TableHead>
            <TableRow>
              <TableCell width="80px" />
              <TableCell width="40px">Enabled</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Networks</TableCell>
              <TableCell>Wallet</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCoins.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <EditCoinControls icon={c.icon} blockchains={c.blockchains} coin={c.coin} wallets={wallets} onSave={handleOnEditCoinSave} />
                </TableCell>
                <TableCell>{c.coin.enabled ? <CheckIcon /> : null}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={c.icon} alt="icon" style={{ height: '1.5rem', marginRight: '0.5rem' }} />
                    {c.coin.symbol}
                  </div>
                </TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  {c.blockchains.map((chain) => (
                    <Chip key={`${c.name}-${chain}`} label={chain} />
                  ))}
                </TableCell>
                <TableCell>{c.coin.wallet ?? 'None'}</TableCell>
                <TableCell>{c.coin.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
