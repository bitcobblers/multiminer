import { Grid, Typography } from '@mui/material';
import { Chain } from '../../models';

export interface ChainMenuItemProps {
  chain: Chain;
}

export function ChainMenuItem(props: ChainMenuItemProps) {
  const { chain } = props;

  return (
    <Grid container>
      <Grid item xs={3}>
        <Typography>{chain.name}</Typography>
      </Grid>
      <Grid>
        <Typography>{chain.description}</Typography>
      </Grid>
    </Grid>
  );
}
