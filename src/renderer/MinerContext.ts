import React from 'react';
import { MinerState } from './services/MinerManager';

export const MinerContext = React.createContext<MinerState>({
  state: 'inactive',
  currentCoin: '',
  miner: '',
});
