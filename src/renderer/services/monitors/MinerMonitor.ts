import { MinerName } from '../../../models';

export type MinerMonitor = {
  name: MinerName;
  statsUrls: string[];
  update: (stats: string[]) => void;
};
