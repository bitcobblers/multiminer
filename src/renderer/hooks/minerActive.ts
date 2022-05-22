import { minerState$ } from '../../models';
import { useObservableState } from './observable';

export function useMinerActive() {
  const [minerState] = useObservableState(minerState$, null);

  return minerState?.state === 'active';
}
