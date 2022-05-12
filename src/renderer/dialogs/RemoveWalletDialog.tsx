import { DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { Coin } from '../../models';
import { UsedByCoins } from '../components/UsedByCoins';
import { CustomDialogActions } from './CustomDialogActions';

interface RemoveWalletDialogProps {
  name: string;
  open: boolean;
  id: string;
  coins: Coin[];
  onRemove: (name: string, id: string) => void;
  onCancel: () => void;
}

export function RemoveWalletDialog(props: RemoveWalletDialogProps) {
  const { open, name, id, coins, onRemove, onCancel, ...other } = props;
  const isUsedByCoins = coins.length;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '450px' } }} open={open} {...other}>
      <DialogTitle sx={{ textAlign: 'center' }}>Remove Wallet</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {isUsedByCoins === 0 ? 'Are you sure you want to remove this wallet?' : `Cannot remove this wallet because it is depended on by ${isUsedByCoins} coin(s).`}
        </Typography>
        <UsedByCoins coins={coins} />
        <Divider />
        <CustomDialogActions buttonType="submit" buttonText="Yes" onConfirm={() => onRemove(name, id)} secondaryButtonText="No" onCancel={onCancel} primaryButtonDisabled={isUsedByCoins > 0} />
      </DialogContent>
    </Dialog>
  );
}
