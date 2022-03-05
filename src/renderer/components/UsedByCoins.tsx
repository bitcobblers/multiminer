import { Divider, Grid, Chip, Typography } from '@mui/material';
import { Coin } from '../../models';

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
      <br />
      <Typography>Used by</Typography>
      <br />
      <Grid container justifyContent="center" spacing={2}>
        {coins.map((c) => (
          <Chip key={c.symbol} label={c.symbol} />
        ))}
      </Grid>
      <br />
    </>
  );
}
