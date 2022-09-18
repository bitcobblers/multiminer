import * as formatter from '../../renderer/services/Formatters';

describe('Formatters Service', () => {
  describe('Hashrate For Empty Values', () => {
    const cases = [
      null,
      undefined,
    ];

    test.each(cases)('%p', (given) => {
      // Act.
      const result = formatter.hashrate(given);

      // Assert.
      expect(result).toBe('N/A');
    });
  });

  describe('Hashrate Formatting', () => {
    it('Should return raw number if no scale provided.', () => {
      // Act.
      const result = formatter.hashrate(10);

      // Assert.
      expect(result).toBe('10');
    });

    it('Should return unaltered suffix for M', () => {
      // Act.
      const result = formatter.hashrate(10, 'M');

      // Assert.
      expect(result).toBe('10MH/s');
    });

    it('Should return scaled number scaled by 1000 for K', () => {
      // Act.
      const result = formatter.hashrate(1000, 'K');

      // Assert.
      expect(result).toBe('1KH/s');
    });
  });

  describe('Uptime', () => {
    const cases = [
      { expected: 'N/A' },
      { given: 1, expected: '1s' },
      { given: 1.5, expected: '1s' },
      { given: 60, expected: '1min' },
      { given: 60.5, expected: '1min' },
      { given: 90, expected: '1min 30s' },
      { given: 3600, expected: '1hr' },
      { given: 3600.5, expected: '1hr' },
      { given: 3601, expected: '1hr 1s' },
      { given: 3660, expected: '1hr 1min' },
      { given: 3690, expected: '1hr 1min 30s' },
      { given: 86400, expected: '1d' },
      { given: 86400.5, expected: '1d' },
      { given: 86401, expected: '1d 1s' },
      { given: 86460, expected: '1d 1min' },
      { given: 86490, expected: '1d 1min 30s' },
      { given: 90000, expected: '1d 1hr' },
      { given: 90001, expected: '1d 1hr 1s' },
      { given: 90060, expected: '1d 1hr 1min' },
      { given: 90090, expected: '1d 1hr 1min 30s' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.uptime(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });

  describe('Duration', () => {
    const cases = [
      { expected: 'N/A' },
      { given: 1, expected: '1hr' },
      { given: 24, expected: '1d' },
      { given: 30, expected: '1d 6hr' },
      { given: 168, expected: '1w' },
      { given: 192, expected: '1w 1d' },
      { given: 193, expected: '1w 1d 1hr' },
    ];

    test.each(cases)('%p', ({ given, expected }) => {
      // Act.
      const result = formatter.duration(given);

      // Assert.
      expect(result).toBe(expected);
    });
  });
});
