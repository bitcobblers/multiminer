import { useEffect, useState, useContext } from 'react';

// UI.
import { Container, Divider, Grid, Button, Typography, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Tabs, Tab } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// Graphs.
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Services.
import { GpuStatistic, MinerStatistic } from '../../models';
import * as formatter from '../services/Formatters';
import { startMiner, stopMiner, nextCoin, minerState$ } from '../services/MinerManager';
import { updateTicker } from '../services/CoinFeed';
import { AlgorithmStat, UnmineableStats, unmineableWorkers$, updateCoins } from '../services/UnmineableFeed';
import { gpuStatistics$, minerStatistics$ } from '../services/MinerEventStreamer';

import { enabledCoins$ } from '../services/DataService';

// Context.
import { MinerContext } from '../MinerContext';

// Screens.
import { ScreenHeader } from '../components/ScreenHeader';
import { TabPanel } from '../components/TabPanel';

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

function WorkerGraph(props: { algorithm: string; stat: AlgorithmStat | undefined }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { algorithm, stat } = props;

  if (stat === undefined) {
    return <p>No data to display!</p>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: algorithm,
      },
    },
  };

  const chr = stat.workers.map((w) => w.chr).reduce((previous, current) => previous + current, 0);
  const rhr = stat.workers.map((w) => w.rhr).reduce((previous, current) => previous + current, 0);

  const labels = stat?.chart.calculated.timestamps;
  const data = {
    labels,
    datasets: [
      {
        label: `Calculated (${chr})`,
        data: stat?.chart.calculated.data,
        borderColor: 'rgb(255,99,132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: `Reported(${rhr})`,
        data: stat?.chart.reported.data,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
}

function WorkersGraphs(props: { workers: UnmineableStats | undefined }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { workers } = props;
  const [tabIndex, setTabIndex] = useState(0);

  if (workers === undefined) {
    return <p>No data to display!</p>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tabClicked = (_event: any, value: number) => {
    setTabIndex(value);
  };

  return (
    <div>
      <Tabs value={tabIndex} onChange={tabClicked}>
        <Tab label="Ethash" />
        <Tab label="Etchash" />
        <Tab label="Kawpow" />
        <Tab label="RandomX" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <WorkerGraph algorithm="Ethash" stat={workers?.ethash} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <WorkerGraph algorithm="Etchash" stat={workers?.etchash} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <WorkerGraph algorithm="Kawpow" stat={workers?.kawpow} />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <WorkerGraph algorithm="RandomX" stat={workers?.randomx} />
      </TabPanel>
    </div>
  );
}

export function HomeScreen(): JSX.Element {
  const [minerActive, setMinerActive] = useState(false);
  const [configuredCoins, setConfiguredCoins] = useState(Array<ConfiguredCoin>());
  const [currentGpuStats, setCurrentGpuStats] = useState(Array<GpuStatistic>());
  const [currentMinerStats, setCurrentMinerStats] = useState({} as MinerStatistic);
  const [workerStats, setWorkerStats] = useState<UnmineableStats>();
  const minerContext = useContext(MinerContext);

  const refreshData = async () => {
    await Promise.allSettled([updateCoins(), updateTicker()]);
  };

  useEffect(() => {
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  }, []);

  useEffect(() => {
    const minerSubscription = minerState$.subscribe((s) => {
      setMinerActive(s.state === 'active');
    });

    const unmineableWorkersSubscription = unmineableWorkers$.subscribe((stats) => {
      setWorkerStats(stats);
    });

    const coinsSubscription = enabledCoins$.subscribe((coins) => {
      setConfiguredCoins(coins);
    });

    const gpuStatsSubscription = gpuStatistics$.subscribe((stats) => {
      setCurrentGpuStats(stats);
    });

    const minerStatsSubscription = minerStatistics$.subscribe((stats) => {
      setCurrentMinerStats(stats);
    });

    return () => {
      minerSubscription.unsubscribe();
      unmineableWorkersSubscription.unsubscribe();
      coinsSubscription.unsubscribe();
      gpuStatsSubscription.unsubscribe();
      minerStatsSubscription.unsubscribe();
    };
  }, [minerContext.currentCoin]);

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
        <Grid item xs={12}>
          <Typography variant="h3">Graphs</Typography>
          <WorkersGraphs workers={workerStats} />
        </Grid>
      </Grid>
    </Container>
  );
}
