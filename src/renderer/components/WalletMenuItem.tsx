import { Grid, Typography } from '@mui/material';
import { Wallet } from '../../models/AppSettings';

export interface WalletMenuItemProps {
  wallet: Wallet;
}

export function WalletMenuItem(props: WalletMenuItemProps) {
  const { wallet } = props;

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography>{wallet.name}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography>{wallet.blockchain}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography>{wallet.memo}</Typography>
      </Grid>
    </Grid>
  );
}
