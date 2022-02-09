import { screenBuffer, clearBuffer } from '../../renderer/services/ScreenBuffer';
import { stdout } from '../../renderer/services/MinerService';

describe('Screen Buffer Tests', () => {
  it('Clearing buffer should reset it to empty string', () => {
    // Arrange.
    const handler = jest.fn();
    const subscription = screenBuffer.subscribe(handler);

    // Act.
    clearBuffer();
    subscription.unsubscribe();

    // Assert.
    expect(handler).toBeCalledTimes(2); // Additional call for initial state.
    expect(handler).lastCalledWith('');
  });

  it('Should update content when called', () => {
    // Arrange.
    const handler = jest.fn();
    const subscription = screenBuffer.subscribe(handler);

    // Act.
    clearBuffer();
    stdout.next('expected');
    subscription.unsubscribe();

    // Assert.
    expect(handler).lastCalledWith('expected');
  });

  it('Calling twice should automatically create a newline', () => {
    // Arrange.
    const handler = jest.fn();
    const subscription = screenBuffer.subscribe(handler);
    const expected = 'line1\nline2';

    // Act.
    clearBuffer();
    stdout.next('line1');
    stdout.next('line2');
    subscription.unsubscribe();

    // Assert.
    expect(handler).lastCalledWith(expected);
  });
});
