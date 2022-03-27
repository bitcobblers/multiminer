import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { Container, Box, Button, TableContainer, TableCell, TableHead, TableRow, TableBody, Table } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useSnackbar } from 'notistack';

import { Miner } from '../../models';
import { getMiners, setMiners, defaults } from '../services/AppSettingsService';

import { ScreenHeader, EditMinerControls } from '../components';
import { EditMinerDialog } from '../dialogs/EditMinerDialog';

const getEmptyMiner = (): Miner => {
  return { id: uuid(), kind: 'lolminer', name: '', version: '', enabled: false, algorithm: 'ethash', parameters: '' };
};

export function MinersScreen() {
  const { enqueueSnackbar } = useSnackbar();
  const [newOpen, setNewOpen] = useState(false);
  const [newMiner, setNewMiner] = useState(getEmptyMiner());
  const [miners, setLoadedMiners] = useState(defaults.miners);

  useEffect(() => {
    const init = async () => {
      setLoadedMiners(await getMiners());
    };

    init();
  }, []);

  const handleOnAddMiner = () => {
    setNewOpen(true);
  };

  const saveMiner = async (miner: Miner) => {
    const index = miners.findIndex((m) => m.id === miner.id);
    const updatedMiners = [...miners];

    updatedMiners.splice(index, 1);
    updatedMiners.splice(index, 0, miner);

    await setMiners(updatedMiners);
    setLoadedMiners(updatedMiners);

    enqueueSnackbar(`Miner ${miner.name} updated.`, { variant: 'success' });
  };

  const addMiner = async (miner: Miner) => {
    const updatedMiners = miners.concat(miner);

    await setMiners(updatedMiners);

    setNewMiner(getEmptyMiner);
    setLoadedMiners(updatedMiners);
    setNewOpen(false);

    enqueueSnackbar(`Miner ${miner.name} added.`, { variant: 'success' });
  };

  const removeMiner = async (name: string, id: string) => {
    const updatedMiners = [...miners.filter((m) => m.id !== id)];

    await setMiners(updatedMiners);
    setLoadedMiners(updatedMiners);

    enqueueSnackbar(`Miner ${name} removed.`, { variant: 'success' });
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
        <EditMinerDialog key="edit-new-miner" open={newOpen} miner={newMiner} existingMiners={miners} autoReset onSave={addMiner} onCancel={() => setNewOpen(false)} />
        <TableContainer>
          <Table aria-label="Miners">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Enabled</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Miner</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Algorithm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {miners.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <EditMinerControls miner={m} onSave={saveMiner} existingMiners={miners} onRemove={removeMiner} />
                  </TableCell>
                  <TableCell>{m.enabled ? <CheckIcon /> : <></>}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.kind}</TableCell>
                  <TableCell>{m.version}</TableCell>
                  <TableCell>{m.algorithm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
