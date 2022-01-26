/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { AvailableAlgorithms, AvailableMiners, Miner, MinerName } from '../../models/Configuration';
import { AlgorithmMenuItem } from '../components/AlgorithmMenuItem';
import { MinerTypeMenuItem } from '../components/MinerTypeMenuItem';

type EditMinerDialogProps = {
  open: boolean;
  miner: Miner;

  onSave: (miner: Miner) => void;
  onCancel: () => void;
};

const getSelectableAlgorithms = (newMinerType: MinerName) => {
  const selectedMiner = AvailableMiners.find((m) => m.name === newMinerType);
  const selectedMinerAlgorithms = selectedMiner?.algorithms ?? [];

  return AvailableAlgorithms.filter((alg) => selectedMinerAlgorithms.indexOf(alg.name) !== -1);
};

export function EditMinerDialog(props: EditMinerDialogProps) {
  const { open, miner, onSave, onCancel, ...other } = props;
  const [minerType, setMinerType] = useState(miner.info);
  const [name, setName] = useState(miner.name);
  const [enabled, setEnabled] = useState(miner.enabled);
  const [installationPath, setInstallationPath] = useState(miner.installationPath);
  const [algorithm, setAlgorithm] = useState(miner.algorithm);
  const [parameters, setParameters] = useState(miner.parameters);

  // Internal cache.
  const [selectableAlgorithms, setSelectableAlgorithms] = useState(getSelectableAlgorithms(minerType));

  const handleOnNameChange = (e: any) => {
    setName(e.target.value.trim());
  };

  const handleOnMinerTypeChange = (e: any) => {
    const newMinerType = e.target.value.trim();

    setMinerType(newMinerType);
    setSelectableAlgorithms(getSelectableAlgorithms(newMinerType));
  };

  const handleOnEnabledChange = (e: any) => {
    setEnabled(e.target.checked);
  };

  const handleOnAlgorithmChange = (e: any) => {
    setAlgorithm(e.target.value.trim());
  };

  const handleOnInstallationPathChange = (e: any) => {
    setInstallationPath(e.target.value.trim());
  };

  const handleOnParametersChange = (e: any) => {
    setParameters(e.target.value.trim());
  };

  const validateName = (): [boolean, string] => {
    if (name.length === 0) {
      return [true, 'A miner must have a name.'];
    }

    return [false, ''];
  };

  const validateMinerType = (): [boolean, string] => {
    if (minerType.length === 0) {
      return [true, 'A miner type must have a specified.'];
    }

    return [false, ''];
  };

  const validateAlgorithm = (): [boolean, string] => {
    if (algorithm.length === 0) {
      return [true, 'An algorithm must be specified.'];
    }

    return [false, ''];
  };

  const handleOnSave = () => {
    onSave({ id: miner.id, info: minerType, name, enabled, installationPath, algorithm, parameters });
  };

  const [isNameInvalid, nameValidationMessage] = validateName();
  const [isMinerTypeInvalid, minerTypeValidationMessage] = validateMinerType();
  const [isAlgorithmInvalid, algorithmValidationMessage] = validateAlgorithm();
  const isInvalid = enabled ? isNameInvalid || isMinerTypeInvalid || isAlgorithmInvalid : false;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
      <DialogTitle>Edit Miner</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <FormControlLabel control={<Switch checked={enabled} onChange={handleOnEnabledChange} />} label="Enabled" />
            <TextField disabled={!enabled} required label="Name" defaultValue={miner.name} onChange={handleOnNameChange} error={isNameInvalid} helperText={nameValidationMessage} />
            <TextField disabled={!enabled} required label="Miner" select value={minerType} onChange={handleOnMinerTypeChange} error={isMinerTypeInvalid} helperText={minerTypeValidationMessage}>
              {AvailableMiners.sort((a, b) => a.name.localeCompare(b.name)).map((m) => (
                <MenuItem key={m.name} value={m.name}>
                  <MinerTypeMenuItem miner={m} />
                </MenuItem>
              ))}
            </TextField>
            <TextField disabled={!enabled} required label="Algorithm" select value={algorithm} onChange={handleOnAlgorithmChange} error={isAlgorithmInvalid} helperText={algorithmValidationMessage}>
              {selectableAlgorithms.map((alg) => (
                <MenuItem key={alg.name} value={alg.name}>
                  <AlgorithmMenuItem algorithm={alg} />
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row">
              <TextField disabled={!enabled} label="Installation Path" defaultValue={miner.installationPath} onChange={handleOnInstallationPathChange} />
              <Button disabled={!enabled}>Browse</Button>
            </Stack>
            <TextField disabled={!enabled} label="Parameters" defaultValue={miner.parameters} onChange={handleOnParametersChange} />
            <Divider />
            <Button disabled={isInvalid} onClick={handleOnSave}>
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Stack>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
