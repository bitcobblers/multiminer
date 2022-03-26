import { DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { CustomDialogActions } from './CustomDialogActions';

type RemoveMinerDialogProps = {
  open: boolean;
  onClose: (result: boolean) => void;
};

export function RemoveMinerDialog(props: RemoveMinerDialogProps) {
  const { open, onClose, ...other } = props;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '450px' } }} open={open} {...other}>
      <DialogTitle sx={{ textAlign: 'center' }}>Remove Miner</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Are you sure you want to remove this miner?
        </Typography>
        <Divider />
        <CustomDialogActions buttonType="submit" buttonText="Yes" onConfirm={() => onClose(true)} secondaryButtonText="No" onCancel={() => onClose(false)} />
      </DialogContent>
    </Dialog>
  );
}
