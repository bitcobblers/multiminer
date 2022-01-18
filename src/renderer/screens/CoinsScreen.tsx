/* eslint-disable react/destructuring-assignment */

import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { Container, TableContainer, TableCell, TableHead, TableRow, TableBody, Chip, Table } from '@mui/material';
import { AllCoins, CoinDefinition } from '../../models/Coins';
import { Coin, Wallet } from '../../models/Configuration';
import { AppSettingsService } from '../services/AppSettingsService';
import { ScreenHeader } from '../components/ScreenHeader';
import { EditCoinDialog } from '../dialogs/EditCoinDialog';

type CoinRecord = {
  definition: CoinDefinition;
  coin: Coin;
};

interface CoinsScreenState {
  wallets: Wallet[];
  coins: CoinRecord[];
  openEditor: string;
}

interface CoinsScreenProps {
  appSettingsService: AppSettingsService;
}

export class CoinsScreen extends React.Component<CoinsScreenProps, CoinsScreenState> {
  constructor(props: CoinsScreenProps) {
    super(props);

    this.state = {
      wallets: [],
      coins: [],
      openEditor: '',
    };
  }

  async componentDidMount() {
    const { appSettingsService } = this.props;
    const wallets = await appSettingsService.getWallets();
    const coins = await appSettingsService.getCoins();

    this.setState({
      wallets,
      openEditor: '',
      coins: AllCoins.map((cd) => {
        const coin = coins.find((c) => c.symbol === cd.symbol);

        return {
          definition: cd,
          coin: coin ?? this.blankCoin(cd.symbol, cd.referral),
        };
      }),
    });
  }

  handleOnEditCoinSave = async (record: CoinRecord, coin: Coin) => {
    const { appSettingsService } = this.props;
    const coins = await appSettingsService.getCoins();
    const index = coins.findIndex((c) => c.symbol === coin.symbol);
    const updatedCoins = [...coins];

    if (index !== -1) {
      updatedCoins.splice(index, 1);
      updatedCoins.splice(index, 0, coin);
    } else {
      updatedCoins.push(coin);
    }

    await appSettingsService.setCoins(updatedCoins);
    record.coin = coin;

    this.setState({
      openEditor: '',
    });
  };

  handleOnEditCoinCancel = () => {
    this.setState({ openEditor: '' });
  };

  blankCoin = (symbol: string, referral: string): Coin => {
    return {
      symbol,
      referral,
      wallet: '',
      algorithm: '',
      enabled: false,
      duration: '',
    };
  };

  getOpenEditor = (symbol: string) => this.state.openEditor === symbol;

  editCoin = (symbol: string) => this.setState({ openEditor: symbol });

  render() {
    const { wallets, coins } = this.state;

    return (
      <Container>
        <ScreenHeader title="Coins" />
        {coins.map((c) => (
          <EditCoinDialog
            key={`edit-coin-${c.definition.symbol}`}
            open={this.getOpenEditor(c.definition.symbol)}
            onSave={async (coin) => this.handleOnEditCoinSave(c, coin)}
            onCancel={this.handleOnEditCoinCancel}
            icon={c.definition.icon}
            symbol={c.definition.symbol}
            blockchains={c.definition.blockchains}
            wallets={wallets}
            coin={c.coin}
          />
        ))}
        <TableContainer>
          <Table aria-label="Coins">
            <TableHead>
              <TableRow>
                <TableCell width="80px" />
                <TableCell width="100px">Icon</TableCell>
                <TableCell width="10%">Symbol</TableCell>
                <TableCell width="25%">Name</TableCell>
                <TableCell width="25%">Networks</TableCell>
                <TableCell width="40px">Enabled</TableCell>
                <TableCell width="15%">Wallet</TableCell>
                <TableCell width="25%">Referral</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coins
                .sort((a, b) => a.definition.symbol.localeCompare(b.definition.symbol))
                .map((c) => (
                  <TableRow key={c.definition.id}>
                    <TableCell>
                      <EditIcon onClick={() => this.editCoin(c.definition.symbol)} />
                    </TableCell>
                    <TableCell>
                      <img src={c.definition.icon} alt="icon" />
                    </TableCell>
                    <TableCell>{c.definition.symbol}</TableCell>
                    <TableCell>{c.definition.name}</TableCell>
                    <TableCell>
                      {c.definition.blockchains.map((chain) => (
                        <Chip key={`${c.definition.name}-${chain}`} label={chain} />
                      ))}
                    </TableCell>
                    <TableCell>{c.coin.enabled ? <CheckIcon /> : <></>}</TableCell>
                    <TableCell>{c.coin.wallet}</TableCell>
                    <TableCell>{c.coin.referral}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }
}
