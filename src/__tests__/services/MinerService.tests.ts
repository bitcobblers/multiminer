import { ApiReceiveEvent, ApiExitEvent, MinerService } from '../../renderer/services/MinerService';
import { ExitedCallback, MinerApi } from '../../shared/MinerApi';

const getApi = (parameters: Partial<MinerApi>): MinerApi => {
  return {
    ...{
      start: async () => Promise.resolve(''),
      stop: async () => Promise.resolve(),
      receive: async () => Promise.resolve(),
      exited: async () => Promise.resolve(),
      ...parameters,
    },
  };
};

describe('Miner Service', () => {
  it('Constructing automatically wires up handlers.', () => {
    // Arrange.
    const api = getApi({});
    const spyReceive = jest.spyOn(api, 'receive');
    const spyExited = jest.spyOn(api, 'exited');

    // Act.
    // eslint-disable-next-line no-new
    new MinerService(api);

    // Assert.
    expect(spyReceive).toBeCalled();
    expect(spyExited).toBeCalled();
  });

  it('Calling start() will preemptively call stop() first.', async () => {
    // Arrange.
    const api = getApi({});
    const stopSpy = jest.spyOn(api, 'stop');
    const miner = new MinerService(api);

    // Act.
    await miner.start('/path/to/miner', 'args');

    // Assert.
    expect(stopSpy).toBeCalled();
  });

  it('Calling stop() will call the underlying api stop method.', async () => {
    // Arrange.
    const api = getApi({});
    const stopSpy = jest.spyOn(api, 'stop');
    const miner = new MinerService(api);

    // Act.
    await miner.start('/path/to/miner', 'args');
    await miner.stop();

    // Assert.
    expect(stopSpy).toBeCalledTimes(2); // Once for start(), a second for stop().
  });

  it('Calling start() will call the underlying api start method.', async () => {
    // Arrange.
    const api = getApi({});
    const startSpy = jest.spyOn(api, 'start');
    const miner = new MinerService(api);

    // Act.
    await miner.start('/path/to/miner', 'args');

    // Assert.
    expect(startSpy).toBeCalled();
  });

  it('Receive handler will fire when data is received.', async () => {
    // Arrange.
    let x: ApiReceiveEvent | undefined;

    const api = getApi({
      receive: async (callback: ApiReceiveEvent) => {
        x = callback;
      },
    });

    const handler = jest.fn();
    const miner = new MinerService(api);
    miner.onReceive(handler);

    // Act.
    if (x !== undefined) {
      x('data');
    }

    // Assert.
    expect(handler).toBeCalled();
  });

  it('Exit handler will fire when data is exited.', async () => {
    // Arrange.
    let x: ExitedCallback | undefined;

    const api = getApi({
      exited: async (callback: ExitedCallback) => {
        x = callback;
      },
    });

    const handler = jest.fn();
    const miner = new MinerService(api);
    miner.onExit(handler);

    // Act.
    if (x !== undefined) {
      x(0);
    }

    // Assert.
    expect(handler).toBeCalled();
  });

  it('Unsubscribing receive handler will prevent future events from firing.', async () => {
    // Arrange.
    let x: ApiReceiveEvent | undefined;

    const api = getApi({
      receive: async (callback: ApiReceiveEvent) => {
        x = callback;
      },
    });

    const handler = jest.fn();
    const miner = new MinerService(api);
    miner.onReceive(handler);
    miner.offReceive(handler);

    // Act.
    if (x !== undefined) {
      x('data');
    }

    // Assert.
    expect(handler).not.toHaveBeenCalled();
  });

  it('Unsubscribing exit handler will will prevent future events from firing.', async () => {
    // Arrange.
    let x: ExitedCallback | undefined;

    const api = getApi({
      exited: async (callback: ApiExitEvent) => {
        x = callback;
      },
    });

    const handler = jest.fn();
    const miner = new MinerService(api);
    miner.onExit(handler);
    miner.offExit(handler);

    // Act.
    if (x !== undefined) {
      x(0);
    }

    // Assert.
    expect(handler).not.toHaveBeenCalled();
  });
});
