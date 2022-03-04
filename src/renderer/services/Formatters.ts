export function number(value: number | undefined, maxDigits = 8) {
  return value === undefined ? 'N/A' : value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxDigits });
}

export function currency(value: number | undefined) {
  return value === undefined ? 'N/A' : value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 8 });
}

export function hashrate(value: number | undefined) {
  return value === undefined ? 'N/A' : `${value}MH/s`;
}

export function shares(accepted: number | undefined, rejected: number | undefined) {
  return `${number(accepted ?? 0)} / ${number(rejected ?? 0)}`;
}

export function best(value: string | undefined) {
  return value === undefined ? 'N/A' : value;
}

export function found(accepted: number | undefined, rejected: number | undefined) {
  return number((accepted ?? 0) + (rejected ?? 0));
}

export function power(value: number | undefined) {
  return value === undefined ? 'N/A' : `${number(value)}W`;
}

export function efficiency(value: number | undefined) {
  if (value === undefined) {
    return 'N/A';
  }

  // TODO: This needs special logic to handle miners that report this in KH/W vs MH/W.
  return `${number(value)}KH/W`;
}

export function clockSpeed(speed: number | undefined) {
  return speed === undefined ? 'N/A' : `${speed.toLocaleString()}MHz`;
}

export function temperature(value: number | undefined) {
  return value === undefined ? 'N/A' : `${value}°`;
}

export function percentage(percent: number | undefined) {
  return percent === undefined ? 'N/A' : `${number(percent, 2)}%`;
}

export function difficulty(value: string | undefined) {
  return value === undefined ? 'N/A' : `${value}`;
}

export function progress(mined: number | undefined, threshold: number | undefined) {
  return mined === undefined || threshold === undefined || mined === 0 || threshold === 0 ? 'N/A' : `${number((100 * mined) / threshold, 2)}%`;
}

export function minedValue(mined: number | undefined, price: number | undefined) {
  return mined === undefined || price === undefined ? currency(0) : currency(mined * price);
}
