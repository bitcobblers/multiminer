import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button, Typography, Divider } from '@mui/material';

type RemoveMinerDialogProps = {
  open: boolean;
  onClose: (result: boolean) => void;
};

export function RemoveMinerDialog(props: RemoveMinerDialogProps) {
  const { open, onClose, ...other } = props;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '450px' } }} open={open} {...other}>
      <DialogTitle>Remove Miner</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">Are you sure you want to remove this miner?</Typography>
        <Divider />
        <Button onClick={() => onClose(true)}>Yes</Button>
        <Button onClick={() => onClose(false)}>No</Button>
      </DialogContent>
    </Dialog>
  );
}
