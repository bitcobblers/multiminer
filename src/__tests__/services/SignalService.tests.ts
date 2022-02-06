import { Signal } from '../../renderer/services/SignalService';

describe('SignalService', () => {
  it('Should fire handler when triggered.', () => {
    // Arrange.
    const signal = new Signal<number>();
    const handler = jest.fn();
    signal.on(handler);

    // Act.
    signal.trigger(0);

    // Assert.
    expect(handler).toHaveBeenCalled();
  });

  it('Should fire all handlers when triggered.', () => {
    // Arrange.
    const signal = new Signal<number>();
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    signal.on(handler1);
    signal.on(handler2);

    // Act.

    signal.trigger(0);

    // Assert.
    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it('Attempting to register handler multiple times will only register it once..', () => {
    // Arrange.
    const signal = new Signal<number>();
    const handler = jest.fn();
    signal.on(handler);
    signal.on(handler);

    // Act.
    signal.trigger(0);

    // Assert.
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('Unregistering handler prevents it from being called.', () => {
    // Arrange.
    const signal = new Signal<number>();
    const handler = jest.fn();
    signal.on(handler);
    signal.off(handler);

    // Act.
    signal.trigger(0);

    // Assert.
    expect(handler).not.toHaveBeenCalled();
  });
});
