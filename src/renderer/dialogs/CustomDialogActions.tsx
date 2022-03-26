import { DialogActions, Button } from '@mui/material';

interface CustomDialogActionsProps {
  onCancel: () => unknown;
  onConfirm?: () => unknown;
  buttonType?: 'submit' | 'button' | 'reset';
  buttonText?: string;
  secondaryButtonText?: string;
}

export const CustomDialogActions = (props: CustomDialogActionsProps) => {
  const { onConfirm, onCancel, buttonType, buttonText, secondaryButtonText } = props;
  return (
    <DialogActions sx={{ mt: '0.4rem', display: 'flex', '& .MuiButton-root': { flex: 1, height: '3rem' } }}>
      <Button onClick={() => onConfirm?.()} type={buttonType ?? 'button'}>
        {buttonText ?? 'Save'}
      </Button>
      <Button onClick={() => onCancel()} color="error">
        {secondaryButtonText ?? 'cancel'}
      </Button>
    </DialogActions>
  );
};

CustomDialogActions.defaultProps = {
  onConfirm: undefined,
  buttonType: 'button',
  buttonText: 'Save',
  secondaryButtonText: 'Cancel',
};
