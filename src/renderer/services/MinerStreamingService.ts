import { MinerService } from './MinerService';
import { Signal } from './SignalService';

type LineHandler = {
  match: RegExp;
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void, globalUpdated: (stat: GlobalStatistic) => void) => void;
};

export type GpuStatistic = {
  id: string;
  name: string;
  field: string;
  value: string;
};

export type GlobalStatistic = {
  field: string;
  value: string;
};

export class BaseMinerStreamingService {
  private readonly gpuStatistics = new Signal<GpuStatistic>();

  private readonly globalStatistics = new Signal<GlobalStatistic>();

  private readonly lineHandlers: LineHandler[];

  private miner?: MinerService;

  constructor(lineHandlers: LineHandler[]) {
    this.lineHandlers = lineHandlers;
  }

  public watch(miner: MinerService) {
    this.miner = miner;
    this.miner?.onReceive(this.receivedData);
    this.miner?.onExit(this.receivedExit);
  }

  public unwatch() {
    this.miner?.offReceive(this.receivedData);
    this.miner?.offExit(this.receivedExit);
  }

  public subscribe(gpuUpdatedHandler: (value: GpuStatistic) => void, globalUpdateHandler: (value: GlobalStatistic) => void) {
    this.gpuStatistics.on(gpuUpdatedHandler);
    this.globalStatistics.on(globalUpdateHandler);
  }

  public unsubscribe(gpuUpdatedHandler: (value: GpuStatistic) => void, globalUpdateHandler: (value: GlobalStatistic) => void) {
    this.gpuStatistics.off(gpuUpdatedHandler);
    this.globalStatistics.off(globalUpdateHandler);
  }

  private receivedExit() {
    this.globalStatistics.trigger({ field: 'status', value: 'exited' });
  }

  private receivedData(line: string) {
    const handler = this.lineHandlers.find((h) => h.match.test(line) === true);

    handler?.parse(line, this.gpuStatistics.trigger, this.globalStatistics.trigger);
  }
}

// Process: lolminer.exe
// Multiple graphics cards???
// Commandline:  lolminer.exe --algo ETHASH --user xxx --pool xxx
