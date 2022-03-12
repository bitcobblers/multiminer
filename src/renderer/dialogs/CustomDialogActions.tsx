import { DialogActions, Button } from '@mui/material';

interface CustomDialogActionsProps {
  onCancel: () => unknown;
  onConfirm?: () => unknown;
  buttonType?: 'submit' | 'button' | 'reset';
  buttonText?: string;
}

export const CustomDialogActions = (props: CustomDialogActionsProps) => {
  const { onConfirm, onCancel, buttonType, buttonText } = props;
  return (
    <DialogActions sx={{ mt: '0.4rem', display: 'flex', '& .MuiButton-root': { flex: 1, height: '3rem' } }}>
      <Button onClick={() => onConfirm?.()} type={buttonType ?? 'button'}>
        {buttonText ?? 'Save'}
      </Button>
      <Button onClick={() => onCancel()} color="error">
        Cancel
      </Button>
    </DialogActions>
  );
};

CustomDialogActions.defaultProps = {
  onConfirm: undefined,
  buttonType: 'button',
  buttonText: 'Save',
};
