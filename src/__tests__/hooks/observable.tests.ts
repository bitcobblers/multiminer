import { renderHook } from '@testing-library/react-hooks';
import { Subject } from 'rxjs';
import { useObservable } from '../../renderer/hooks';

describe('Observable Hook', () => {
  it('Executes handler when observable is updated.', () => {
    // Arrange.
    const observable = new Subject<string>();
    let value = '';

    // Act.
    renderHook(() =>
      useObservable(observable, (s) => {
        value = s;
      })
    );

    observable.next('expected');

    // Act.
    expect(value).toBe('expected');
  });
});
