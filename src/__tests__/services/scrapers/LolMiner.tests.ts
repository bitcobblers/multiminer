import {
  GpuStatusLineHandler,
  SummaryLineHandler,
  NewJobLineHandler,
  AverageSpeedLineHandler,
  UptimeLineHandler,
  FoundShareLineHandler,
  ShareAcceptedLineHandler,
} from '../../../renderer/services/scrapers/LolMiner';

describe('LolMiner Parser', () => {
  describe('Gpu Status Tests', () => {
    const line = 'GPU 0 RTX 3080 93.33  41.55   2/0/0  33.7G  223.3   0.417  1269  10241    56   70';
    const handler = GpuStatusLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const id = '0';
      const name = 'RTX 3080';

      const expectedHashrate = { id, name, field: 'hashrate', value: '93.33' };
      const expectedAccepted = { id, name, field: 'accepted', value: '2' };
      const expectedRejected = { id, name, field: 'rejected', value: '0' };
      const expectedBest = { id, name, field: 'best', value: '33.7G' };
      const expectedPower = { id, name, field: 'power', value: '223.3' };
      const expectedEfficiency = { id, name, field: 'efficiency', value: '0.417' };
      const expectedCoreClock = { id, name, field: 'cclk', value: '1269' };
      const expectedMemoryClock = { id, name, field: 'mclk', value: '10241' };
      const expectedCoreTemperature = { id, name, field: 'core_temp', value: '56' };
      const expectedFanSpeed = { id, name, field: 'fan_speed', value: '70' };
      const updateGpu = jest.fn();

      // Act.
      handler.parse(line, updateGpu);

      // Assert.
      expect(updateGpu).toBeCalledWith(expectedHashrate);
      expect(updateGpu).toBeCalledWith(expectedAccepted);
      expect(updateGpu).toBeCalledWith(expectedRejected);
      expect(updateGpu).toBeCalledWith(expectedBest);
      expect(updateGpu).toBeCalledWith(expectedPower);
      expect(updateGpu).toBeCalledWith(expectedEfficiency);
      expect(updateGpu).toBeCalledWith(expectedCoreClock);
      expect(updateGpu).toBeCalledWith(expectedMemoryClock);
      expect(updateGpu).toBeCalledWith(expectedCoreTemperature);
      expect(updateGpu).toBeCalledWith(expectedFanSpeed);
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
      const expectedHashrate = { field: 'hashrate', value: '93.29' };
      const expectedAccepted = { field: 'accepted', value: '1' };
      const expectedRejected = { field: 'rejected', value: '0' };
      const expectedBest = { field: 'best', value: '33.7G' };
      const expectedPower = { field: 'power', value: '223.3' };
      const expectedEfficiency = { field: 'efficiency', value: '0.417' };
      const updateMiner = jest.fn();

      // Act.
      handler.parse(line, jest.fn(), updateMiner);

      // Assert.
      expect(updateMiner).toBeCalledWith(expectedHashrate);
      expect(updateMiner).toBeCalledWith(expectedAccepted);
      expect(updateMiner).toBeCalledWith(expectedRejected);
      expect(updateMiner).toBeCalledWith(expectedBest);
      expect(updateMiner).toBeCalledWith(expectedPower);
      expect(updateMiner).toBeCalledWith(expectedEfficiency);
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
      const expectedId = { field: 'job', value: '0xc40592' };
      const expectedEpoch = { field: 'epoch', value: '471' };
      const expectedDifficulty = { field: 'difficulty', value: '8.73G' };
      const updateMiner = jest.fn();

      // Act.
      handler.parse(line, jest.fn(), updateMiner);

      // Assert.
      expect(updateMiner).toBeCalledWith(expectedId);
      expect(updateMiner).toBeCalledWith(expectedEpoch);
      expect(updateMiner).toBeCalledWith(expectedDifficulty);
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
      const expected = { field: 'hashrate', value: '93.37' };
      const updateMiner = jest.fn();

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
      const expected = { field: 'uptime', value: '0h 4m 0s' };
      const updateMiner = jest.fn();

      // Act.
      handler.parse(line, jest.fn(), updateMiner);

      // Assert.
      expect(updateMiner).toBeCalledWith(expected);
    });
  });

  describe('Found Share Tests', () => {
    const line = 'GPU 0: Found a share of difficulty 12.19G';
    const handler = FoundShareLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const expected = { id: '0', field: 'found', value: '12.19G' };
      const updateGpu = jest.fn();

      // Act.
      handler.parse(line, updateGpu);

      // Assert.
      expect(updateGpu).toBeCalledWith(expected);
    });
  });

  describe('Share Accepted Tests', () => {
    const line = 'GPU 0: Share accepted (19 ms)';
    const handler = ShareAcceptedLineHandler;

    it('Should match against filter', () => {
      expect(handler.match.test(line)).toBe(true);
    });

    it('Should extract all fields', () => {
      // Arrange.
      const expected = { id: '0', field: 'accepted' };
      const updateGpu = jest.fn();

      // Act.
      handler.parse(line, updateGpu);

      // Assert.
      expect(updateGpu).toBeCalledWith(expected);
    });
  });
});
