/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogTitle, DialogContent, Button, TextField, Stack, MenuItem, FormControl, Divider, FormControlLabel, Switch } from '@mui/material';
import { AvailableAlgorithms, AvailableMiners, Miner, MinerInfo, AlgorithmName, MinerName } from '../../models/Configuration';
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

const getDefaultAlgorithm = (name: MinerName, algorithm: AlgorithmName): AlgorithmName => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const miner = AvailableMiners.find((m) => m.name === name)!;

  if (miner.algorithms.findIndex((alg) => alg === algorithm) !== -1) {
    return algorithm;
  }

  return miner.algorithms[0];
};

export function EditMinerDialog(props: EditMinerDialogProps) {
  const { open, miner, onSave, onCancel, ...other } = props;
  const [workingMiner, setWorkingMiner] = useState({
    type: miner.type,
    name: miner.name,
    enabled: miner.enabled,
    installationPath: miner.installationPath,
    algorithm: miner.algorithm,
    parameters: miner.parameters,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [originalState, setOriginalState] = useState(workingMiner);

  const handleOnNameChange = (e: any) => {
    const name = e.target.value.trim();
    setWorkingMiner({ ...workingMiner, ...{ name } });
  };

  const handleOnMinerTypeChange = (e: any) => {
    const type = e.target.value.trim();
    const algorithm = getDefaultAlgorithm(type, workingMiner.algorithm);

    setWorkingMiner({ ...workingMiner, ...{ type, algorithm } });
  };

  const handleOnEnabledChange = (e: any) => {
    const enabled = e.target.checked;
    setWorkingMiner({ ...workingMiner, ...{ enabled } });
  };

  const handleOnAlgorithmChange = (e: any) => {
    const algorithm = e.target.value.trim();
    setWorkingMiner({ ...workingMiner, ...{ algorithm } });
  };

  const handleOnInstallationPathChange = (e: any) => {
    const installationPath = e.target.value.trim();
    setWorkingMiner({ ...workingMiner, ...{ installationPath } });
  };

  const handleOnParametersChange = (e: any) => {
    const parameters = e.target.value.trim();
    setWorkingMiner({ ...workingMiner, ...{ parameters } });
  };

  const validateName = (): [boolean, string] => {
    const { name } = workingMiner;

    if (name.length === 0) {
      return [true, 'A miner must have a name.'];
    }

    return [false, ''];
  };

  const validateMinerType = (): [boolean, string] => {
    const { type } = workingMiner;

    if (type.length === 0) {
      return [true, 'A miner type must have a specified.'];
    }

    return [false, ''];
  };

  const validateAlgorithm = (): [boolean, string] => {
    const { algorithm } = workingMiner;

    if (algorithm.length === 0) {
      return [true, 'An algorithm must be specified.'];
    }

    return [false, ''];
  };

  const handleOnSave = () => {
    const { type, name, enabled, installationPath, algorithm, parameters } = workingMiner;
    onSave({ id: miner.id, type, name, enabled, installationPath, algorithm, parameters });
  };

  const handleOnCancel = () => {
    onCancel();
    setWorkingMiner(originalState);
  };

  const { enabled, type, algorithm } = workingMiner;
  const [isNameInvalid, nameValidationMessage] = validateName();
  const [isMinerTypeInvalid, minerTypeValidationMessage] = validateMinerType();
  const [isAlgorithmInvalid, algorithmValidationMessage] = validateAlgorithm();
  const isInvalid = enabled ? isNameInvalid || isMinerTypeInvalid || isAlgorithmInvalid : false;
  const minerTypeAlgorithms = getSelectableAlgorithms(type);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Dialog sx={{ '& .MuiDialog-paper': { width: '500px' } }} open={open} {...other}>
      <DialogTitle>Edit Miner</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <FormControlLabel control={<Switch checked={enabled} onChange={handleOnEnabledChange} />} label="Enabled" />
            <TextField disabled={!enabled} required label="Name" defaultValue={miner.name} onChange={handleOnNameChange} error={isNameInvalid} helperText={nameValidationMessage} />
            <TextField disabled={!enabled} required label="Miner" select value={type} onChange={handleOnMinerTypeChange} error={isMinerTypeInvalid} helperText={minerTypeValidationMessage}>
              {AvailableMiners.sort((a, b) => a.name.localeCompare(b.name)).map((m) => (
                <MenuItem key={m.name} value={m.name}>
                  <MinerTypeMenuItem miner={m} />
                </MenuItem>
              ))}
            </TextField>
            <TextField disabled={!enabled} required label="Algorithm" select value={algorithm} onChange={handleOnAlgorithmChange} error={isAlgorithmInvalid} helperText={algorithmValidationMessage}>
              {minerTypeAlgorithms.map((alg) => (
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
            <Button onClick={handleOnCancel}>Cancel</Button>
          </Stack>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
