import { useEffect, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { Container, TableContainer, TableCell, TableHead, TableRow, TableBody, Chip, Table, FormControlLabel, Switch } from '@mui/material';
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

const blankCoin = (symbol: string, referral: string): Coin => {
  return {
    symbol,
    referral,
    wallet: '',
    enabled: false,
    duration: '',
  };
};

export function CoinsScreen() {
  const [wallets, setWallets] = useState([] as Wallet[]);
  const [coins, setLoadedCoins] = useState([] as CoinRecord[]);
  const [enabledOnly, setEnabledOnly] = useState(false);

  useEffect(() => {
    const readConfigAsync = async () => {
      const loadedCoins = await getCoins();
      const parsedCoins = ALL_COINS.map((cd) => {
        const coin = loadedCoins.find((c) => {
          return c.symbol === cd.symbol;
        });

        return {
          id: cd.id,
          icon: cd.icon,
          name: cd.name,
          blockchains: cd.blockchains,
          isSet: coin !== undefined,
          coin: coin ?? blankCoin(cd.symbol, cd.referral),
        };
      });

      setWallets(await getWallets());
      setLoadedCoins(parsedCoins);
    };

    readConfigAsync();
  }, []);

  const handleOnEditCoinSave = async (coin: Coin) => {
    const index = coins.findIndex((c) => c.coin.symbol === coin.symbol);
    const updatedCoin = { ...coins[index], ...{ isSet: true, coin } };
    const updatedCoins = [...coins];

    updatedCoins.splice(index, 1);
    updatedCoins.splice(index, 0, updatedCoin);

    await setCoins(updatedCoins.filter((c) => c.isSet).map((c) => c.coin));
    setLoadedCoins(updatedCoins);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEnabledOnlyChange = (e: any) => {
    setEnabledOnly(e.target.checked);
  };

  return (
    <Container>
      <ScreenHeader title="Coins" />
      <FormControlLabel control={<Switch checked={enabledOnly} onChange={handleEnabledOnlyChange} />} label="Only Show Enabled" />
      <TableContainer>
        <Table aria-label="Coins">
          <TableHead>
            <TableRow>
              <TableCell width="80px" />
              <TableCell width="40px">Enabled</TableCell>
              <TableCell width="100px">Icon</TableCell>
              <TableCell width="10%">Symbol</TableCell>
              <TableCell width="20%">Name</TableCell>
              <TableCell width="25%">Networks</TableCell>
              <TableCell width="10%">Wallet</TableCell>
              <TableCell width="15%">Duration (hr)</TableCell>
              <TableCell width="20%">Referral</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coins
              .filter((c) => (enabledOnly ? c.coin.enabled : true))
              .sort((a, b) => a.coin.symbol.localeCompare(b.coin.symbol))
              .map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <EditCoinControls icon={c.icon} blockchains={c.blockchains} coin={c.coin} wallets={wallets} onSave={handleOnEditCoinSave} />
                  </TableCell>
                  <TableCell>{c.coin.enabled ? <CheckIcon /> : <></>}</TableCell>
                  <TableCell>
                    <img src={c.icon} alt="icon" />
                  </TableCell>
                  <TableCell>{c.coin.symbol}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>
                    {c.blockchains.map((chain) => (
                      <Chip key={`${c.name}-${chain}`} label={chain} />
                    ))}
                  </TableCell>
                  <TableCell>{c.coin.wallet}</TableCell>
                  <TableCell>{c.coin.duration}</TableCell>
                  <TableCell>{c.coin.referral}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
