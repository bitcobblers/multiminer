import { Divider, Grid, Chip, Typography } from '@mui/material';
import { Coin } from '../../models/Configuration';

export interface UsedByCoinsProps {
  coins: Coin[];
}

export function UsedByCoins(props: UsedByCoinsProps) {
  const { coins } = props;

  if (coins.length === 0) {
    return <></>;
  }

  return (
    <>
      <Divider />
      <Typography>Used by</Typography>
      <Grid>
        {coins.map((c) => (
          <Chip key={c.symbol} label={c.symbol} />
        ))}
      </Grid>
    </>
  );
}
