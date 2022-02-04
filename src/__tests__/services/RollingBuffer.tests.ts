import { RollingBuffer } from '../../renderer/services/RollingBuffer';

describe('Rolling Buffer', () => {
  it('Adding data updates content property.', () => {
    // Arrange.
    const buffer = new RollingBuffer();

    // Act.
    buffer.addContent('test');

    // Expect.
    expect(buffer.content).toBe('test');
  });

  it('Adding lines flushes content automatically.', () => {
    // Arrange.
    const buffer = new RollingBuffer(2, 1);

    // Act.
    buffer.addContent('bad');
    buffer.addContent('good');

    // Expect.
    expect(buffer.content).toBe('good');
  });

  it('Automatically adds newlines before beginning of new content.', () => {
    // Arrange.
    const buffer = new RollingBuffer();

    // Act.
    buffer.addContent('line1');
    buffer.addContent('line2');

    // Expect.
    expect(buffer.content).toBe('line1\nline2');
  });

  it('Automatically replaces CRLF with LF.', () => {
    // Arrange.
    const buffer = new RollingBuffer();

    // Act.
    buffer.addContent('line1\r\nline2');
    const hasCrlf = buffer.content.indexOf('\r\n');

    // Expect.
    expect(hasCrlf).toBe(-1);
  });

  it('Internal counter is updated by total number of lines added.', () => {
    // Arrange.
    const buffer = new RollingBuffer();

    // Act.
    buffer.addContent('line1\r\n\r\nline2');

    // Expect.
    expect(buffer.numLines).toBe(3);
  });

  it('Attempting to trim too many lines does not alter content.', () => {
    // Arrange.
    const buffer = new RollingBuffer(10, 1);
    buffer.addContent('expected');

    // Act.
    buffer.trimContent();

    // Expect.
    expect(buffer.content).toBe('expected');
  });

  it('Clearing buffer resets its content and length.', () => {
    // Arrange.
    const buffer = new RollingBuffer();
    buffer.addContent('content');

    // Act.
    buffer.clear();

    // Expect.
    expect(buffer.content).toBe('');
    expect(buffer.numLines).toBe(0);
  });
});
