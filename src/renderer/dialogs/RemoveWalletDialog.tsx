import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button, Typography, Divider } from '@mui/material';
import { UsedByCoins } from '../components/UsedByCoins';
import { Coin } from '../../models/AppSettings';

interface RemoveWalletDialogProps {
  open: boolean;
  id: string;
  coins: Coin[];
  onRemove: (id: string) => void;
  onCancel: () => void;
}

const getPageContent = (isUsedByCoins: number) => {
  if (isUsedByCoins === 0) {
    return 'Are you sure you want to remove this wallet?';
  }

  return `Cannot remove this wallet because it is depended on by ${isUsedByCoins} coin(s).`;
};

export function RemoveWalletDialog(props: RemoveWalletDialogProps) {
  const { open, id, coins, onRemove, onCancel, ...other } = props;
  const isUsedByCoins = coins.length;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '450px' } }} open={open} {...other}>
      <DialogTitle>Remove Wallet</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">{getPageContent(coins.length)}</Typography>
        <br />
        <UsedByCoins coins={coins} />
        <Divider />
        <Button disabled={isUsedByCoins > 0} onClick={() => onRemove(id)}>
          Yes
        </Button>
        <Button onClick={onCancel}>No</Button>
      </DialogContent>
    </Dialog>
  );
}
