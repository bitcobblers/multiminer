import { Grid, Typography } from '@mui/material';
import { AlgorithmInfo } from '../../models/Configuration';

export interface AlgorithmMenuItemProps {
  algorithm: AlgorithmInfo;
}

export function AlgorithmMenuItem(props: AlgorithmMenuItemProps) {
  const { algorithm } = props;

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography>{algorithm.name}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography>{algorithm.kind}</Typography>
      </Grid>
    </Grid>
  );
}
