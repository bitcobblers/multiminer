import { renderHook } from '@testing-library/react';
import { act } from 'react-test-renderer';
import { Subject } from 'rxjs';
import { useObservable, useObservableState } from '../../renderer/hooks';

describe('Observable Hook', () => {
  it('Executes handler when observable is updated.', () => {
    // Arrange.
    const observable = new Subject<string>();
    let value = '';

    // Act.
    renderHook(() => useObservable(observable, (s) => {
      value = s;
    }));

    observable.next('expected');

    // Act.
    expect(value).toBe('expected');
  });

  it('Updates state variable when observable is updated.', () => {
    // Arrange.
    const observable = new Subject<string>();

    // Act.
    const { result } = renderHook(() => useObservableState(observable, null));

    act(() => {
      observable.next('expected');
    });

    // Assert.
    const [value] = result.current;
    expect(value).toBe('expected');
  });

  it('State is initially set to default value.', () => {
    // Arrange.
    const observable = new Subject<string>();

    // Act.
    const { result } = renderHook(() => useObservableState(observable, 'expected'));

    // Assert.
    const [value] = result.current;
    expect(value).toBe('expected');
  });
});
