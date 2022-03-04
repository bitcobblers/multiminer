import { useState, useEffect } from 'react';

import dateFormat from 'dateformat';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { Tabs, Tab } from '@mui/material';
import { TabPanel } from '../TabPanel';
import { AlgorithmStat, UnmineableStats } from '../../services/UnmineableFeed';

function WorkersGraph(props: { algorithm: string; stat: AlgorithmStat | undefined }) {
  const { algorithm, stat } = props;

  if (stat === undefined || stat.workers === undefined || stat.chart === undefined) {
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
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Hashrate (MH/s)',
        },
      },
    },
  };

  const chr = stat.workers.map((w) => w.chr).reduce((previous, current) => previous + current, 0);
  const rhr = stat.workers.map((w) => w.rhr).reduce((previous, current) => previous + current, 0);

  const labels = stat?.chart.calculated.timestamps.map((ts) => dateFormat(new Date(ts), 'yyyy/mm/dd HH:MM:ss'));
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

export function WorkersGraphs(props: { workers: UnmineableStats | undefined }) {
  const { workers } = props;
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  }, []);

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
        <WorkersGraph algorithm="Ethash" stat={workers?.ethash} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <WorkersGraph algorithm="Etchash" stat={workers?.etchash} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <WorkersGraph algorithm="Kawpow" stat={workers?.kawpow} />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <WorkersGraph algorithm="RandomX" stat={workers?.randomx} />
      </TabPanel>
    </div>
  );
}
