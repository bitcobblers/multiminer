export function hashrate(value: number | undefined) {
  return value === undefined ? 'N/A' : `${value}`;
}

export function shares(accepted: number | undefined, rejected: number | undefined) {
  return `${accepted ?? 0} / ${rejected ?? 0}`;
}

export function best(value: string | undefined) {
  return value === undefined ? 'N/A' : value;
}

export function found(accepted: number | undefined, rejected: number | undefined) {
  return `${(accepted ?? 0) + (rejected ?? 0)}`;
}

export function power(value: number | undefined) {
  return value === undefined ? 'N/A' : `${value.toLocaleString()}W`;
}

export function efficiency(value: number | undefined) {
  if (value === undefined) {
    return 'N/A';
  }

  // TODO: This needs special logic to handle miners that report this in KH/W vs MH/W.
  return `${value}`;
}

export function clockSpeed(speed: number | undefined) {
  return speed === undefined ? 'N/A' : `${speed.toLocaleString()}MHz`;
}

export function temperature(value: number | undefined) {
  return value === undefined ? 'N/A' : `${value}°`;
}

export function percentage(percent: number | undefined) {
  return percent === undefined ? 'N/A' : `${percent}%`;
}

export function difficulty(value: string | undefined) {
  return value === undefined ? 'N/A' : `${value}`;
}

export function number(value: number | undefined) {
  return value === undefined ? 'N/A' : `${value.toLocaleString()}`;
}

export function currency(value: number | undefined) {
  return value === undefined ? 'N/A' : `${value.toLocaleString('en-US')}`;
}

export function progress(mined: number | undefined, threshold: number | undefined) {
  return mined === undefined || threshold === undefined || mined === 0 || threshold === 0 ? 'N/A' : `${(mined / threshold).toLocaleString()}%`;
}

export function minedValue(mined: number | undefined, price: number | undefined) {
  return mined === undefined || price === undefined ? currency(0) : currency(mined * price);
}
