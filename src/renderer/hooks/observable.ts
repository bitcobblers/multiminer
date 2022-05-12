import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export function useObservable<T>(observable: Observable<T>, handler: (value: T) => void) {
  useEffect(() => {
    const subscription = observable.subscribe(handler);

    return () => {
      subscription.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useObservableState<T>(observable: Observable<T>, defaultValue: T) {
  const state = useState<T>(defaultValue);
  const [, setCurrent] = state;

  useEffect(() => {
    const subscription = observable.subscribe(setCurrent);

    return () => {
      subscription.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
