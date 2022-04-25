import { MinerName } from '../../../models';

export type MinerMonitor = {
  name: MinerName;
  statsUrl: string;
  update: (stats: string) => void;
};
