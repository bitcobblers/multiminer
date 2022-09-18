import { MinerName } from '../../../models';

export type MinerMonitor = {
  name: MinerName;
  statsUrl: string | string[];
  update: (stats: string | string[]) => void;
};
