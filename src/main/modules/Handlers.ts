import { IpcMainInvokeEvent } from 'electron';

export default interface Handlers {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (event: IpcMainInvokeEvent, ...args: any[]) => any;
}
