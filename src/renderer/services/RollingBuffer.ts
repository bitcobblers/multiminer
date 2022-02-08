import { BehaviorSubject } from 'rxjs';
import { stdout } from './MinerService';

export const screenBuffer = new BehaviorSubject<string>('');

let maxLines = 2000;
let flushAmount = 1;
let numLines = 0;

function getNthInstance(content: string, character: string, n: number) {
  const { length } = content;
  let index = 0;
  let remaining = n;

  while (index < length) {
    if (content[index] === character) {
      remaining -= 1;

      if (remaining === 0) {
        return index;
      }
    }

    index += 1;
  }

  return 0;
}

function trimContent(content: string) {
  const numCharacters = getNthInstance(content, '\n', flushAmount);

  if (numCharacters === 0 && content[0] !== '\n') {
    return '';
  }

  return content.substring(numCharacters + 1);
}

export function setBufferSize(lines: number) {
  maxLines = lines;
}

export function setFlushAmount(lines: number) {
  flushAmount = lines;
}

export function clearBuffer() {
  numLines = 0;
  screenBuffer.next('');
}

stdout.subscribe((line) => {
  if (screenBuffer.value === '') {
    screenBuffer.next(line);
  } else if (numLines >= maxLines) {
    numLines -= flushAmount;
    screenBuffer.next(`${trimContent(screenBuffer.value)}\n${line}`);
  } else {
    screenBuffer.next(`${screenBuffer.value}\n${line}`);
  }

  numLines += 1;
});
