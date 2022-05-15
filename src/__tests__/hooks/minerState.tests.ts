import { renderHook } from '@testing-library/react-hooks';
import { useMinerActive } from '../../renderer/hooks';
import { minerState$ } from '../../models';

describe('MinerActive Hook', () => {
  it('Returns false if there is no state.', () => {
    // Act.
    const { result } = renderHook(() => useMinerActive());

    // Assert.
    expect(result.current).toBe(false);
  });

  describe('Messages toggle state.', () => {
    const cases = [
      { given: 'active', expected: true },
      { given: 'inactive', expected: false },
    ];

    test.each(cases)('State set to %p should be %p', ({ given, expected }) => {
      // Arrange.
      const { result, waitForNextUpdate } = renderHook(() => useMinerActive());

      // Act.
      minerState$.next({
        state: given as 'active' | 'inactive',
        currentCoin: null,
      });

      waitForNextUpdate();

      // Assert.
      expect(result.current).toBe(expected);
    });
  });
});
