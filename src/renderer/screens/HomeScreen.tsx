import { useEffect, useState, useContext } from 'react';
import { Container, Divider, Grid, Button, Typography, Table, TableContainer, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// Services.
import { GpuStatistic, MinerStatistic } from '../services/Aggregates';
import * as formatter from '../services/Formatters';
import { getCoins } from '../services/AppSettingsService';
import { startMiner, stopMiner, nextCoin, minerState$ } from '../services/MinerManager';
import { ticker, updateTicker } from '../services/CoinFeed';
import { unmineableCoins$, unmineableWorkers$, updateCoins } from '../services/UnmineableFeed';
import { gpuStatistics$, minerStatistics$ } from '../services/MinerEventStreamer';

// Context.
import { MinerContext } from '../MinerContext';
import { AllCoins } from '../../models/Coins';

// Screens.
import { ScreenHeader } from '../components/ScreenHeader';

type ConfiguredCoin = {
  current: boolean;
  icon: string;
  symbol: string;
  mined?: number;
  price?: number;
  threshold?: number;
  duration: number;
};

function DevicesTable(props: { gpus: GpuStatistic[] }) {
  const { gpus } = props;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Hashrate</TableCell>
            <TableCell>Shares</TableCell>
            <TableCell>Best</TableCell>
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
              <TableCell>{formatter.best(gpu.best)}</TableCell>
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

function MinerTable(props: { miner: MinerStatistic }) {
  const { miner } = props;
  const { hashrate, accepted, rejected, best, power, efficiency, difficulty, uptime } = miner;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hashrate</TableCell>
            <TableCell>Found</TableCell>
            <TableCell>Shares</TableCell>
            <TableCell>Best</TableCell>
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
            <TableCell>{formatter.best(best)}</TableCell>
            <TableCell>{formatter.power(power)}</TableCell>
            <TableCell>{formatter.efficiency(efficiency)}</TableCell>
            <TableCell>{formatter.difficulty(difficulty)}</TableCell>
            <TableCell>{uptime}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function CoinsTable(props: { coins: ConfiguredCoin[] }) {
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

export function HomeScreen(): JSX.Element {
  const [minerActive, setMinerActive] = useState(false);
  const [configuredCoins, setConfiguredCoins] = useState(Array<ConfiguredCoin>());
  const [currentGpuStats, setCurrentGpuStats] = useState(Array<GpuStatistic>());
  const [currentMinerStats, setCurrentMinerStats] = useState({} as MinerStatistic);
  const minerContext = useContext(MinerContext);

  const refreshData = async () => {
    updateCoins();
    updateTicker();
  };

  useEffect(() => {
    const minerSubscription = minerState$.subscribe((s) => {
      setMinerActive(s.state === 'active');
    });

    return () => {
      minerSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const tickerSubscription = ticker.subscribe((coins) => {
      const updatedConfiguredCoins = Array<ConfiguredCoin>();

      configuredCoins.forEach((currentCoin) => {
        const updatedCoin = coins.find((c) => c.symbol === currentCoin.symbol);

        if (updatedCoin !== null) {
          updatedConfiguredCoins.push({
            ...currentCoin,
            ...{
              current: minerContext.currentCoin === currentCoin.symbol,
              price: updatedCoin?.price,
            },
          });
        } else {
          updatedConfiguredCoins.push(currentCoin);
        }
      });

      setConfiguredCoins(updatedConfiguredCoins);
    });

    const unmineableCoinsSubscription = unmineableCoins$.subscribe((coins) => {
      coins.forEach((c) => {
        if (c.symbol === minerContext.currentCoin) {
          // updateWorkers(c.uuid);
        }
      });

      const updatedConfiguredCoins = Array<ConfiguredCoin>();

      configuredCoins.forEach((currentCoin) => {
        const updatedCoin = coins.find((c) => c.symbol === currentCoin.symbol);

        if (updatedCoin !== null) {
          updatedConfiguredCoins.push({
            ...currentCoin,
            ...{
              current: minerContext.currentCoin === currentCoin.symbol,
              mined: updatedCoin?.balance,
              threshold: updatedCoin?.threshold,
            },
          });
        } else {
          updatedConfiguredCoins.push(currentCoin);
        }
      });

      setConfiguredCoins(updatedConfiguredCoins);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unmineableWorkersSubscription = unmineableWorkers$.subscribe((stats) => {});

    return () => {
      tickerSubscription.unsubscribe();
      unmineableCoinsSubscription.unsubscribe();
      unmineableWorkersSubscription.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadConfiguredCoins = async () => {
      const enabledCoins = (await getCoins()).filter((c) => c.enabled);
      const parsedCoins = AllCoins.filter((cd) => enabledCoins.find((c) => c.symbol === cd.symbol)).map((cd) => {
        const coin = enabledCoins.find((c) => {
          return c.symbol === cd.symbol;
        });

        return {
          current: cd.symbol === minerContext.currentCoin ?? '',
          icon: cd.icon,
          symbol: cd.symbol,
          mined: 0,
          price: 0,
          value: 0,
          threshold: 0,
          progress: 0,
          duration: coin?.duration ?? 0,
        } as ConfiguredCoin;
      });

      setConfiguredCoins(parsedCoins);
    };

    loadConfiguredCoins();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const gpuStatsSubscription = gpuStatistics$.subscribe((stats) => {
      setCurrentGpuStats(stats);
    });

    const minerStatsSubscription = minerStatistics$.subscribe((stats) => {
      setCurrentMinerStats(stats);
    });

    return () => {
      gpuStatsSubscription.unsubscribe();
      minerStatsSubscription.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <ScreenHeader title="Home" />
      <Divider />
      <Button disabled={minerActive || minerContext.miner === null} onClick={async () => startMiner()}>
        Start Miner
      </Button>
      <Button disabled={!minerActive} onClick={async () => stopMiner()}>
        Stop Miner
      </Button>
      <Button disabled={!minerActive || minerContext.miner === null} onClick={async () => nextCoin()}>
        Next Coin
      </Button>
      <Button onClick={async () => refreshData()}>Refresh</Button>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">Devices</Typography>
          <DevicesTable gpus={currentGpuStats} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">Miner</Typography>
          <MinerTable miner={currentMinerStats} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">Coins</Typography>
          <CoinsTable coins={configuredCoins} />
        </Grid>
      </Grid>
    </Container>
  );
}
