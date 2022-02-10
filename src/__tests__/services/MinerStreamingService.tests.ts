import { GpuStatistic, MinerStatistic, gpuStatistics, minerStatistics, setHandlers } from '../../renderer/services/MinerStreamingService';
import { stdout } from '../../renderer/services/MinerService';

describe('Miner Streaming Service Tests', () => {
  it('Should fire handler for GPU statistic', () => {
    // Arrange.
    const gotStat = jest.fn();
    const handlers = [
      {
        match: /.*/,
        parse: (_line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
          gpuUpdated({ id: '0', name: 'GPU', field: 'field', value: 'x' });
        },
      },
    ];

    setHandlers(handlers);
    const subscription = gpuStatistics.subscribe(gotStat);

    // Act.
    stdout.next('');
    subscription.unsubscribe();

    expect(gotStat).toBeCalled();
  });

  it('Should fire handler for Miner statistic', () => {
    // Arrange.
    const gotStat = jest.fn();
    const handlers = [
      {
        match: /.*/,
        parse: (_line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
          minerUpdated({ field: 'field', value: 'x' });
        },
      },
    ];

    setHandlers(handlers);
    const subscription = minerStatistics.subscribe(gotStat);

    // Act.
    stdout.next('');
    subscription.unsubscribe();

    expect(gotStat).toBeCalled();
  });

  it('Clearing handlers should not fire statistics', () => {
    // Arrange.
    const gotGpuStat = jest.fn();
    const gotMinerStat = jest.fn();

    setHandlers([]);
    const gpuSubscription = gpuStatistics.subscribe(gotGpuStat);
    const minerSubscription = minerStatistics.subscribe(gotMinerStat);

    // Act.
    stdout.next('');
    gpuSubscription.unsubscribe();
    minerSubscription.unsubscribe();

    expect(gotGpuStat).not.toHaveBeenCalled();
    expect(gotMinerStat).not.toHaveBeenCalled();
  });
});
