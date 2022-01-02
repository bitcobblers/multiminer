import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button } from '@mui/material';

interface RemoveWalletsConfirmationDialogProps {
  open: boolean;
  onClose: (result: boolean) => void;
}

export function RemoveWalletsConfirmationDialog(props: RemoveWalletsConfirmationDialogProps) {
  const { onClose, open, ...other } = props;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '450px' } }} open={open} {...other}>
      <DialogTitle>Are you sure you want to delete this wallet?</DialogTitle>
      <DialogContent dividers>
        <Button onClick={() => onClose(true)}>Yes</Button>
        <Button onClick={() => onClose(false)}>No</Button>
      </DialogContent>
    </Dialog>
  );
}
