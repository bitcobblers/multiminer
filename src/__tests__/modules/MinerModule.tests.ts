import fs from 'fs';
import * as minerModule from '../../main/modules/MinerModule';
import { logger } from '../../main/logger';

require('child_process').spawn = jest.fn();

describe('Miner Module', () => {
  logger.debug = jest.fn();
  logger.error = jest.fn();

  it('Should call onError if the miner path does not exist.', () => {
    // Arrange.
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const handlers = {
      onError: jest.fn(),
      onSuccess: jest.fn(),
    };

    // Act.
    minerModule.launch('path/to/unknown', 'ignored', handlers);

    // Assert.
    expect(handlers.onError).toBeCalled();
    expect(handlers.onSuccess).not.toBeCalled();
  });

  it('Should call onError if the miner path is not an executable.', () => {
    // Arrange.
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'accessSync').mockImplementation(() => {
      throw new Error('expected');
    });

    const handlers = {
      onError: jest.fn(),
      onSuccess: jest.fn(),
    };

    // Act.
    minerModule.launch('path/to/exe', 'ignored', handlers);

    // Assert.
    expect(handlers.onError).toBeCalled();
    expect(handlers.onSuccess).not.toBeCalled();
  });

  it('Should call onSuccess if the miner started successfully.', () => {
    // Arrange.
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'accessSync').mockImplementation();

    const handlers = {
      onError: jest.fn(),
      onSuccess: jest.fn(),
    };

    // Act.
    minerModule.launch('path/to/exe', 'ignored', handlers);

    // Assert.
    expect(handlers.onError).not.toBeCalled();
    expect(handlers.onSuccess).toBeCalled();
  });

  it('Should not send an event when process is interrupted.', () => {
    // Arrange.
    const send = jest.fn();

    // Act.
    minerModule.handleExit(0, 'SIGINT', send);

    // Assert.
    expect(send).not.toHaveBeenCalled();
  });

  it('Should send an event when process is killed.', async () => {
    // Arrange.
    const send = jest.fn();

    // Act.
    minerModule.handleExit(0, 'SIGKILL', send);

    // Assert.
    expect(send).toHaveBeenCalled();
  });

  it('Should send an event when the error handler is called.', () => {
    // Arrange.
    const send = jest.fn();

    // Act.
    minerModule.handleError(new Error('ignored'), send);

    // Assert.
    expect(send).toHaveBeenCalled();
  });

  it('Should send an event when the data handler is called.', () => {
    // Arrange.
    const send = jest.fn();

    // Act.
    minerModule.handleData('ignored', send);

    // Assert.
    expect(send).toHaveBeenCalled();
  });
});
