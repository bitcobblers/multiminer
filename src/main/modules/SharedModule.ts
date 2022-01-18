import Handlers from './handlers';

export default interface SharedModule {
  name: string;
  handlers: Handlers;

  reset: () => void;
}
