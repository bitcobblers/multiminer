import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react-test-renderer';
import { useMinerActive } from '../../renderer/hooks';
import { minerState$ } from '../../models';

describe('MinerActive Hook', () => {
  it('Returns false if there is no state.', async () => {
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

    test.each(cases)('State set to %p should be %p', async ({ given, expected }) => {
      // Arrange.
      const { result } = renderHook(() => useMinerActive());

      // Act.
      act(() => {
        minerState$.next({
          state: given as 'active' | 'inactive',
          currentCoin: null,
        });
      });

      // Assert.
      await waitFor(() => expect(result.current).toBe(expected));
    });
  });
});
