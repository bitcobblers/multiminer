import { Container, Divider, Typography, Button } from '@mui/material';

import { MinerService } from '../services/MinerService';

type HomeScreenProps = {
  minerService: MinerService;
};

export function HomeScreen(props: HomeScreenProps): JSX.Element {
  const { minerService } = props;

  const startMiner = async () => {
    await minerService.start('C:\\ethereum\\xmrig-6.16.2\\xmrig.exe', '');
  };

  const stopMiner = async () => {
    await minerService.stop();
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>
      <Divider />
      <Button onClick={startMiner}>Start Miner</Button>
      <Button onClick={stopMiner}>Stop Miner</Button>
    </Container>
  );
}
