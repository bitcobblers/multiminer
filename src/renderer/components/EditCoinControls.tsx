import { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { Stack } from '@mui/material';

import { Wallet, Coin } from '../../models/AppSettings';
import { EditCoinDialog } from '../dialogs/EditCoinDialog';

interface EditCoinControlsProps {
  icon: string;
  blockchains: string[];

  coin: Coin;
  wallets: Wallet[];
  onSave: (coin: Coin) => void;
}

export function EditCoinControls(props: EditCoinControlsProps) {
  const { icon, blockchains, coin, wallets, onSave } = props;
  const [open, setOpen] = useState(false);

  const handleOnEditClick = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = (updatedCoin: Coin) => {
    onSave(updatedCoin);
    setOpen(false);
  };

  return (
    <Stack direction="row" spacing={1}>
      <EditCoinDialog open={open} icon={icon} symbol={coin.symbol} blockchains={blockchains} onSave={handleSave} onCancel={handleCancel} wallets={wallets} coin={coin} />
      <EditIcon onClick={handleOnEditClick} />
    </Stack>
  );
}
