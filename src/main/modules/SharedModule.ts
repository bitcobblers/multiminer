import { IpcMainInvokeEvent } from 'electron';

type Handlers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (event: IpcMainInvokeEvent, ...args: any[]) => any;
};

export type SharedModule = {
  name: string;
  handlers: Handlers;
  reset?: () => void;
};
