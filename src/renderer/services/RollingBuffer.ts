export class RollingBuffer {
  private readonly maxLines: number;

  private readonly flushAmount: number;

  numLines = 0;

  content = '';

  constructor(maxLines = 2000, flushAmount = 1) {
    this.maxLines = maxLines;
    this.flushAmount = flushAmount;
  }

  public addContent(data: string) {
    const parsedData = data.replace(/(\r\n)/gm, '\n');
    const newLines = (parsedData.match(/\n/gm) || []).length + 1;

    if (this.content !== '' && this.content.endsWith('\n') === false) {
      this.content += `\n${parsedData}`;
    } else {
      this.content += parsedData;
    }

    this.numLines += newLines;

    if (this.numLines >= this.maxLines) {
      this.trimContent();
    }
  }

  public clear() {
    this.content = '';
    this.numLines = 0;
  }

  public trimContent() {
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
