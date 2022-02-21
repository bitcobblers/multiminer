import { GpuStatistic, MinerStatistic } from '../../../renderer/services/Aggregates';
import { GpuStatusLineHandler, SummaryLineHandler, NewJobLineHandler, AverageSpeedLineHandler, UptimeLineHandler } from '../../../renderer/services/scrapers/LolMiner';

describe('LolMiner Parser', () => {
  describe('Gpu Status Tests', () => {
    const line = 'GPU 0 RTX 3080 93.33  41.55   2/0/0  33.7G  223.3   0.417  1269  10241    56   70';
    const handler = GpuStatusLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const updateGpu = jest.fn();
      const expected: GpuStatistic = {
        id: '0',
        name: 'RTX 3080',
        hashrate: 93.33,
        accepted: 2,
        rejected: 0,
        best: '33.7G',
        power: 223.3,
        efficiency: 0.417,
        coreClock: 1269,
        memClock: 10241,
        coreTemperature: 56,
        fanSpeed: 70,
      };

      // Act.
      handler.parse(line, updateGpu);

      // Assert.
      expect(updateGpu).toBeCalledWith(expected);
    });
  });

  describe('Summary Tests', () => {
    const line = 'Total          93.29  24.24   1/0/0  33.7G  223.3   0.417';
    const handler = SummaryLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const updateMiner = jest.fn();
      const expected: MinerStatistic = {
        hashrate: 93.29,
        accepted: 1,
        rejected: 0,
        best: '33.7G',
        power: 223.3,
        efficiency: 0.417,
      };

      // Act.
      handler.parse(line, jest.fn(), updateMiner);

      // Assert.
      expect(updateMiner).toBeCalledWith(expected);
    });
  });

  describe('New Job Tests', () => {
    const line = 'New job received: 0xc40592 Epoch: 471 Difficulty: 8.73G';
    const handler = NewJobLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const updateMiner = jest.fn();
      const expected: MinerStatistic = {
        job: '0xc40592',
        epoch: 471,
        difficulty: '8.73G',
      };

      // Act.
      handler.parse(line, jest.fn(), updateMiner);

      // Assert.
      expect(updateMiner).toBeCalledWith(expected);
    });
  });

  describe('Average Speed Tests', () => {
    const line = 'Average speed (15s): 93.37 MH/s';
    const handler = AverageSpeedLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should extract the average speed', () => {
      // Arrange.
      const updateMiner = jest.fn();
      const expected: MinerStatistic = {
        hashrate: 93.37,
      };

      // Act.
      handler.parse(line, jest.fn(), updateMiner);

      // Assert.
      expect(updateMiner).toBeCalledWith(expected);
    });
  });

  describe('Uptime Tests', () => {
    const line = 'Uptime: 0h 4m 0s';
    const handler = UptimeLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const updateMiner = jest.fn();
      const expected: MinerStatistic = {
        uptime: '0h 4m 0s',
      };

      // Act.
      handler.parse(line, jest.fn(), updateMiner);

      // Assert.
      expect(updateMiner).toBeCalledWith(expected);
    });
  });
});
