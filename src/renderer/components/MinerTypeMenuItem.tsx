import { Grid, Typography, Chip } from '@mui/material';
import { MinerInfo } from '../../models/AppSettings';

export interface AlgorithmMenuItemProps {
  miner: MinerInfo;
}

export function MinerTypeMenuItem(props: AlgorithmMenuItemProps) {
  const { miner } = props;

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography>{miner.name}</Typography>
      </Grid>
      <Grid item xs={4}>
        {miner.algorithms.map((alg) => (
          <Chip key={alg} label={alg} />
        ))}
      </Grid>
    </Grid>
  );
}
