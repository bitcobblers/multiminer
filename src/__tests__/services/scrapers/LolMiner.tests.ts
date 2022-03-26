import { GpuStatistic, MinerStatistic } from '../../../models';
import { GpuStatusLineHandler, SummaryLineHandler, NewJobLineHandler } from '../../../renderer/services/miners/lolminer/ScreenScraper';

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
        best: '33.7G',
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
      const updateMiner = jest.fn();
      const expected: MinerStatistic = {
        best: '33.7G',
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
});
