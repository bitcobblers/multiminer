import { DependencyList, useEffect } from 'react';
import { Observable } from 'rxjs';

export function useObservable<T>(observable: Observable<T>, handler: (value: T) => void, deps?: DependencyList) {
  useEffect(() => {
    const subscription = observable.subscribe(handler);

    return () => {
      subscription.unsubscribe();
    };
  }, [handler, observable, deps]);
}
