import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button } from '@mui/material';

interface RemoveWalletsConfirmationDialogProps {
  open: boolean;
  numSelectedWallets: number;
  onClose: (result: boolean) => void;
}

export function RemoveWalletsConfirmationDialog(props: RemoveWalletsConfirmationDialogProps) {
  const { onClose, open, numSelectedWallets, ...other } = props;

  const onYes = () => onClose(true);
  const onNo = () => onClose(false);

  const formatTitle = () => {
    if (numSelectedWallets === 1) {
      return 'Are you sure you want to delete this wallet?';
    }

    return `Are you sure you want to delete these ${numSelectedWallets} wallets?`;
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '200' } }} open={open} {...other}>
      <DialogTitle>{formatTitle()}</DialogTitle>
      <DialogContent dividers>
        <Button onClick={onYes}>Yes</Button>
        <Button onClick={onNo}>No</Button>
      </DialogContent>
    </Dialog>
  );
}
