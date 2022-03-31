import * as formatter from '../../renderer/services/Formatters';

describe('Formatters Service', () => {
  describe('Uptime', () => {
    const cases = [
      { expected: 'N/A' },
      { given: 1, expected: '1s' },
      { given: 60, expected: '1min' },
      { given: 90, expected: '1min 30s' },
      { given: 3600, expected: '1hr' },
      { given: 3601, expected: '1hr 1s' },
      { given: 3660, expected: '1hr 1min' },
      { given: 3690, expected: '1hr 1min 30s' },
      { given: 86400, expected: '1d' },
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
});