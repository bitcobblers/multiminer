import { GpuStatistic, MinerStatistic } from '../../models';
import { setHandlers, useScreenScraper } from '../../renderer/services/MinerEventStreamer';
import { clearStatistics, gpuStatistics$, minerStatistics$ } from '../../renderer/services/StatisticsAggregator';
import { stdout$ } from '../../renderer/services/MinerService';

describe('Miner Streaming Service Tests', () => {
  useScreenScraper();

  it('Clearing handlers should not fire statistics', () => {
    // Arrange.
    setHandlers([]);
    clearStatistics();

    const gpuSpy = jest.spyOn(gpuStatistics$, 'next');
    const minerSpy = jest.spyOn(minerStatistics$, 'next');

    // Act.
    stdout$.next('');

    // Assert.
    expect(gpuSpy).not.toHaveBeenCalled();
    expect(minerSpy).not.toHaveBeenCalled();
  });

  describe('GPU Statistics Aggregates', () => {
    it('Adding a new GPU creates a new statistic entry', () => {
      // Arrange.
      const handlers = [
        {
          match: /1/,
          parse: (_line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
            gpuUpdated({ id: '0' });
          },
        },
        {
          match: /2/,
          parse: (_line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
            gpuUpdated({ id: '1' });
          },
        },
      ];

      setHandlers(handlers);
      clearStatistics();

      const expected = [{ id: '0' }, { id: '1' }];
      const spyGpu = jest.spyOn(gpuStatistics$, 'next');

      // Act.
      stdout$.next('1');
      stdout$.next('2');

      // Assert.
      expect(spyGpu).toBeCalledWith(expected);
    });

    it('Updating a GPU updates existing statistic entry', () => {
      // Arrange.
      const handlers = [
        {
          match: /1/,
          parse: (_line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
            gpuUpdated({ id: '0' });
          },
        },
        {
          match: /2/,
          parse: (_line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
            gpuUpdated({ id: '1' });
          },
        },
        {
          match: /3/,
          parse: (_line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
            gpuUpdated({ id: '1', hashrate: 10 });
          },
        },
      ];

      setHandlers(handlers);
      gpuStatistics$.next([]);

      const expected = [{ id: '0' }, { id: '1', hashrate: 10 }];
      const spyGpu = jest.spyOn(gpuStatistics$, 'next');

      // Act.
      stdout$.next('1');
      stdout$.next('2');
      stdout$.next('3');

      // Assert.
      expect(spyGpu).toBeCalledWith(expected);
    });

    it('Updating a GPU does not change omitted statistic entry', () => {
      // Arrange.
      const handlers = [
        {
          match: /1/,
          parse: (_line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
            gpuUpdated({ id: '2', hashrate: 10 });
          },
        },
        {
          match: /2/,
          parse: (_line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
            gpuUpdated({ id: '2', power: 20 });
          },
        },
      ];

      setHandlers(handlers);
      gpuStatistics$.next([]);

      const expected: GpuStatistic[] = [{ id: '2', hashrate: 10, power: 20 }];
      const spyGpu = jest.spyOn(gpuStatistics$, 'next');

      // Act.
      stdout$.next('1');
      stdout$.next('2');

      // Assert.
      expect(spyGpu).toBeCalledWith(expected);
    });
  });

  describe('Miner Statistics Aggregates', () => {
    it('Should fire handler for Miner statistic', () => {
      // Arrange.
      const handlers = [
        {
          match: /.*/,
          parse: (_line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
            minerUpdated({});
          },
        },
      ];

      setHandlers(handlers);

      const minerSpy = jest.spyOn(minerStatistics$, 'next');

      // Act.
      stdout$.next('');

      // Assert.
      expect(minerSpy).toBeCalled();
    });

    it('Updated statistic does not alter unchanged values', () => {
      // Arrange.
      const handlers = [
        {
          match: /1/,
          parse: (_line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
            minerUpdated({ hashrate: 10 });
          },
        },
        {
          match: /2/,
          parse: (_line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
            minerUpdated({ power: 20 });
          },
        },
      ];

      setHandlers(handlers);
      minerStatistics$.next({});

      const expected = { hashrate: 10, power: 20 };
      const minerSpy = jest.spyOn(minerStatistics$, 'next');

      // Act.
      stdout$.next('1');
      stdout$.next('2');

      // Assert.
      expect(minerSpy).toBeCalledWith(expected);
    });
  });
});
