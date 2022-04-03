import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { useState } from 'react';
import { getAppSettings, setAppSettings } from 'renderer/services/AppSettingsService';
import { Miner } from '../../models';
import { EditMinerDialog, RemoveMinerDialog } from '../dialogs';

interface EditMinerControlsProps {
  miner: Miner;
  // eslint-disable-next-line react/require-default-props
  isDefault?: boolean;
  existingMiners: Miner[];
  onSave: (miner: Miner) => void;
  onRemove: (name: string, id: string) => void;
}

export function EditMinerControls(props: EditMinerControlsProps) {
  const { miner, isDefault, existingMiners, onSave, onRemove } = props;
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const handleOnEditClick = () => {
    setEditOpen(true);
  };

  const handleOnRemoveClick = () => {
    setRemoveOpen(true);
  };

  const handleEditCancel = () => {
    setEditOpen(false);
  };

  const handleEditSave = (updatedMiner: Miner) => {
    onSave(updatedMiner);
    setEditOpen(false);
  };

  const handleRemoveClose = (result: boolean) => {
    if (result === true) {
      onRemove(miner.name, miner.id);
    }

    setRemoveOpen(false);
  };

  const setDefaultMiner = async (name: string) => {
    const appSettings = await getAppSettings();
    appSettings.settings.defaultMiner = name;
    await setAppSettings(appSettings);
  };

  return (
    <Stack direction="row" spacing={0}>
      <RemoveMinerDialog open={removeOpen} onClose={handleRemoveClose} />
      <EditMinerDialog open={editOpen} miner={miner} existingMiners={existingMiners} autoReset={false} onSave={handleEditSave} onCancel={handleEditCancel} />
      <Tooltip title={isDefault ? 'Default' : 'Set Default'}>
        {isDefault ? (
          <CheckIcon color="primary" style={{ margin: '8px' }} />
        ) : (
          <IconButton onClick={() => setDefaultMiner(miner.name)}>
            <CheckIcon color="disabled" />
          </IconButton>
        )}
      </Tooltip>
      <Tooltip title="Edit Miner">
        <IconButton aria-label="Edit Miner" onClick={handleOnEditClick}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={isDefault ? 'Cannot remove miner because it is currently selected as the default miner.' : 'Delete Miner'}>
        <div>
          <IconButton aria-label="Delete Miner" disabled={isDefault} onClick={handleOnRemoveClick}>
            <DeleteIcon />
          </IconButton>
        </div>
      </Tooltip>
    </Stack>
  );
}
