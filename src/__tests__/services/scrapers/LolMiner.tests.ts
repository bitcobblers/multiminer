import { GpuStatistic, MinerStatistic } from '../../../models';
import {
  GpuStatusLineHandler,
  SummaryLineHandler,
  NewJobLineHandler,
  AverageSpeedLineHandler,
  UptimeLineHandler,
  GpuStatusLHRLineHandler,
  SummaryLHRLineHandler,
  GpuStatusLHRLineHandler2,
} from '../../../renderer/services/scrapers/LolMiner';

describe('LolMiner Parser', () => {
  describe('Gpu Status Tests', () => {
    const line = 'GPU 0 RTX 3080 93.33  41.55   2/0/0  33.7G  223.3   0.417  1269  10241    56   70';
    const lhrLine1 = 'GPU 0 RTX 3080 66.22 99.16 auto 15/0/0 41.5G 223.2';
    const lhrLine2 = 'GPU 0 0.296 1587 10141 57 70 auto';
    const handler = GpuStatusLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should not match against LHR line1', () => {
      expect(handler.match.test(lhrLine1)).toBe(false);
    });

    it('Should not match against LHR line2', () => {
      expect(handler.match.test(lhrLine2)).toBe(false);
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
        efficiency: 417,
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

  describe('Gpu Status Tests (LHR) First Form', () => {
    const line = 'GPU 0 RTX 3080 66.22 99.16 auto 15/0/0 41.5G 223.2';
    const nonLHRLine = 'GPU 0 RTX 3080 93.33  41.55   2/0/0  33.7G  223.3   0.417  1269  10241    56   70';
    const lhrLine2 = 'GPU 0 0.296 1587 10141 57 70 auto';
    const handler = GpuStatusLHRLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should not match against non-LHR line', () => {
      expect(handler.match.test(nonLHRLine)).toBe(false);
    });

    it('Should not match against LHR line 2', () => {
      expect(handler.match.test(lhrLine2)).toBe(false);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const updateGpu = jest.fn();
      const expected: GpuStatistic = {
        id: '0',
        name: 'RTX 3080',
        hashrate: 66.22,
        accepted: 15,
        rejected: 0,
        best: '41.5G',
        power: 223.2,
      };

      // Act.
      handler.parse(line, updateGpu);

      // Assert.
      expect(updateGpu).toBeCalledWith(expected);
    });
  });

  describe('Gpu Status Tests (LHR) Second Form', () => {
    const line = 'GPU 0 0.296 1587 10141 57 70 auto';
    const nonLHRLine = 'GPU 0 RTX 3080 93.33  41.55   2/0/0  33.7G  223.3   0.417  1269  10241    56   70';
    const lhrLine1 = 'GPU 0 RTX 3080 66.22 99.16 auto 15/0/0 41.5G 223.2';
    const handler = GpuStatusLHRLineHandler2;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should not match against non-LHR line', () => {
      expect(handler.match.test(nonLHRLine)).toBe(false);
    });

    it('Should not match against LHR line 1', () => {
      expect(handler.match.test(lhrLine1)).toBe(false);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const updateGpu = jest.fn();
      const expected: GpuStatistic = {
        id: '0',
        efficiency: 0.296,
        coreClock: 1587,
        memClock: 10141,
        coreTemperature: 57,
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
    const lhrLine = 'Total 66.22 99.16 15/0/0 41.5G 223.2';
    const handler = SummaryLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should not match against LHR line', () => {
      expect(handler.match.test(lhrLine)).toBe(false);
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
        efficiency: 417,
      };

      // Act.
      handler.parse(line, jest.fn(), updateMiner);

      // Assert.
      expect(updateMiner).toBeCalledWith(expected);
    });
  });

  describe('Summary LHR Tests', () => {
    const line = 'Total 66.22 99.16 15/0/0 41.5G 223.2';
    const nonLHRLine = 'Total          93.29  24.24   1/0/0  33.7G  223.3   0.417';
    const handler = SummaryLHRLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should not match against non-LHR line', () => {
      expect(handler.match.test(nonLHRLine)).toBe(false);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const updateMiner = jest.fn();
      const expected: MinerStatistic = {
        hashrate: 66.22,
        accepted: 15,
        rejected: 0,
        best: '41.5G',
        power: 223.2,
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
