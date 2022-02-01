import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { Container, Box, Button, TableContainer, TableCell, TableHead, TableRow, TableBody, Table } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { Miner } from '../../models/Configuration';
import { AppSettingsService, defaults } from '../services/AppSettingsService';

import { ScreenHeader } from '../components/ScreenHeader';
import { EditMinerControls } from '../components/EditMinerControls';
import { EditMinerDialog } from '../dialogs/EditMinerDialog';

type MinersScreenProps = {
  appSettingsService: AppSettingsService;
};

const getEmptyMiner = (): Miner => {
  return { id: uuid(), kind: 'lolminer', name: '', enabled: false, installationPath: '', algorithm: 'ethash', parameters: '' };
};

export function MinersScreen(props: MinersScreenProps) {
  const { appSettingsService } = props;
  const [newOpen, setNewOpen] = useState(false);
  const [newMiner, setNewMiner] = useState(getEmptyMiner());
  const [miners, setMiners] = useState(defaults.miners);

  useEffect(() => {
    const readConfigAsync = async () => {
      setMiners(await appSettingsService.getMiners());
    };

    readConfigAsync();
  }, [appSettingsService]);

  const handleOnAddMiner = () => {
    setNewOpen(true);
  };

  const saveMiner = async (miner: Miner) => {
    const index = miners.findIndex((m) => m.id === miner.id);
    const updatedMiners = [...miners];

    updatedMiners.splice(index, 1);
    updatedMiners.splice(index, 0, miner);

    await appSettingsService.setMiners(updatedMiners);
    setMiners(updatedMiners);
  };

  const addMiner = async (miner: Miner) => {
    const updatedMiners = miners.concat(miner);

    await appSettingsService.setMiners(updatedMiners);

    setNewMiner(getEmptyMiner);
    setMiners(updatedMiners);
    setNewOpen(false);
  };

  const removeMiner = async (id: string) => {
    const updatedMiners = [...miners.filter((m) => m.id !== id)];

    await appSettingsService.setMiners(updatedMiners);
    setMiners(updatedMiners);
  };

  return (
    <Container>
      <ScreenHeader title="Miners" />
      <Button onClick={handleOnAddMiner}>Add Miner</Button>
      <Box
        sx={{
          '& .MuiDataGrid-cell--editing': {
            bgcolor: 'rgb(255,215,115, 0.19)',
            color: '#1a3e72',
          },
          '& .Mui-error': {
            bgcolor: (theme) => `rgb(126,10,15, ${theme.palette.mode === 'dark' ? 0 : 0.1})`,
            color: (theme) => (theme.palette.mode === 'dark' ? '#ff4343' : '#750f0f'),
          },
        }}
      >
        <EditMinerDialog key="edit-new-miner" open={newOpen} miner={newMiner} onSave={addMiner} onCancel={() => setNewOpen(false)} />
        <TableContainer>
          <Table aria-label="Miners">
            <TableHead>
              <TableRow>
                <TableCell width="80px" />
                <TableCell width="40px">Enabled</TableCell>
                <TableCell width="10%">Miner</TableCell>
                <TableCell width="10%">Name</TableCell>
                <TableCell width="10%">Algorithm</TableCell>
                <TableCell width="70%">Installation Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {miners.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <EditMinerControls miner={m} onSave={saveMiner} onRemove={removeMiner} />
                  </TableCell>
                  <TableCell>{m.enabled ? <CheckIcon /> : <></>}</TableCell>
                  <TableCell>{m.kind}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.algorithm}</TableCell>
                  <TableCell>{m.installationPath}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
