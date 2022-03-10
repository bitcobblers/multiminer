import React from 'react';
import { MinerState } from '../models';

export const MinerContext = React.createContext<MinerState>({
  state: 'inactive',
  currentCoin: null,
  miner: null,
});
