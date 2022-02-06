import { Signal } from './SignalService';

export class RollingBuffer {
  private readonly updated = new Signal<string>();

  private readonly maxLines: number;

  private readonly flushAmount: number;

  private numLines = 0;

  content = '';

  constructor(maxLines = 2000, flushAmount = 1) {
    this.maxLines = maxLines;
    this.flushAmount = flushAmount;
  }

  public addContent(data: string) {
    if (this.content === '') {
      this.content += data;
    } else {
      this.content += `\n${data}`;
    }

    this.numLines += 1;

    if (this.numLines >= this.maxLines) {
      this.trimContent();
    }

    this.updated.trigger(this.content);
  }

  clear() {
    this.content = '';
    this.numLines = 0;
  }

  subscribe(handler: (content: string) => void) {
    this.updated.on(handler);
  }

  unsubscribe(handler: (content: string) => void) {
    this.updated.off(handler);
  }

  trimContent() {
    const numCharacters = this.getNthInstance('\n', this.flushAmount);

    if (numCharacters === 0 && this.content[0] !== '\n') {
      return;
    }

    this.content = this.content.substring(numCharacters + 1);
    this.numLines -= this.flushAmount;
  }

  private getNthInstance(character: string, n: number) {
    const { length } = this.content;
    let index = 0;
    let remaining = n;

    while (index < length) {
      if (this.content[index] === character) {
        remaining -= 1;

        if (remaining === 0) {
          return index;
        }
      }

      index += 1;
    }

    return 0;
  }
}
