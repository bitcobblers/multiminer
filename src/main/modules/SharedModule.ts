import Handlers from './Handlers';

export default interface SharedModule {
  name: string;
  handlers: Handlers;

  reset: () => void;
}
