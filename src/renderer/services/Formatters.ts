export function number(value: number | undefined, maxDigits = 8) {
  return value === undefined ? 'N/A' : value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: maxDigits });
}

export function currency(value: number | undefined, maxDigits = 2) {
  return value === undefined ? 'N/A' : value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: maxDigits });
}

export function hashrate(value: number | undefined) {
  return value === undefined ? 'N/A' : `${number(value, 2)}MH/s`;
}

export function shares(accepted: number | undefined, rejected: number | undefined) {
  return `${number(accepted ?? 0)} / ${number(rejected ?? 0)}`;
}

export function found(accepted: number | undefined, rejected: number | undefined) {
  return number((accepted ?? 0) + (rejected ?? 0));
}

export function power(value: number | undefined) {
  return value === undefined ? 'N/A' : `${number(value, 2)}W`;
}

export function efficiency(value: number | undefined) {
  if (value === undefined) {
    return 'N/A';
  }

  // TODO: This needs special logic to handle miners that report this in KH/W vs MH/W.
  return `${number(value, 2)}KH/W`;
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
  return mined === undefined || threshold === undefined || mined === 0 || threshold === 0 ? 0 : (100 * mined) / threshold;
}

export function minedValue(mined: number | undefined, price: number | undefined) {
  return mined === undefined || price === undefined ? currency(0) : currency(mined * price);
}

export function uptime(value: number | undefined) {
  if (value === undefined) {
    return 'N/A';
  }

  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_DAY = 86400;

  const flooredValue = Math.floor(value);

  const totalDays = Math.floor(flooredValue / SECONDS_PER_DAY);
  const totalHours = Math.floor((flooredValue - totalDays * SECONDS_PER_DAY) / SECONDS_PER_HOUR);
  const totalMinutes = Math.floor((flooredValue - totalDays * SECONDS_PER_DAY - totalHours * SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const totalSeconds = flooredValue - totalDays * SECONDS_PER_DAY - totalHours * SECONDS_PER_HOUR - totalMinutes * SECONDS_PER_MINUTE;

  const daysStr = totalDays ? `${totalDays}d` : '';
  const hoursStr = totalHours ? `${totalHours}hr` : '';
  const minutesStr = totalMinutes ? `${totalMinutes}min` : '';
  const secondsStr = totalSeconds ? `${totalSeconds}s` : '';

  const parts = [daysStr, hoursStr, minutesStr, secondsStr].filter((x) => x !== '');

  return parts.join(' ');
}

export function duration(value: number | undefined) {
  if (value === undefined) {
    return 'N/A';
  }

  const HOURS_PER_DAY = 24;
  const HOURS_PER_WEEK = 168;

  const flooredValue = Math.floor(value);

  const totalWeeks = Math.floor(flooredValue / HOURS_PER_WEEK);
  const totalDays = Math.floor((flooredValue - totalWeeks * HOURS_PER_WEEK) / HOURS_PER_DAY);
  const totalHours = flooredValue - totalWeeks * HOURS_PER_WEEK - totalDays * HOURS_PER_DAY;

  const weeksStr = totalWeeks ? `${totalWeeks}w` : '';
  const daysStr = totalDays ? `${totalDays}d` : '';
  const hoursStr = totalHours ? `${totalHours}hr` : '';

  const parts = [weeksStr, daysStr, hoursStr].filter((x) => x !== '');

  return parts.join(' ');
}
