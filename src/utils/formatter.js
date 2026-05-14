// Strips trailing decimal zeros without regex: toFixed(2) then back through parseFloat.
const fmt = (n) => parseFloat(n.toFixed(2)).toString();

// Formats a number as a dollar amount with short-suffix notation.
// Thresholds are exact powers of ten (1e9, etc.) so floating-point drift never
// causes a value to land in the wrong tier.
export const formatCash = (amount) => {
  if (amount >= 1e18) return '$' + fmt(amount / 1e18) + 'Qi';
  if (amount >= 1e15) return '$' + fmt(amount / 1e15) + 'Qa';
  if (amount >= 1e12) return '$' + fmt(amount / 1e12) + 'T';
  if (amount >= 1e9)  return '$' + fmt(amount / 1e9) + 'B';
  if (amount >= 1e6)  return '$' + fmt(amount / 1e6) + 'M';
  if (amount >= 1e3)  return '$' + fmt(amount / 1e3) + 'K';
  return '$' + amount.toLocaleString();
};

// Formats a duration given in minutes as a compact human-readable string,
// skipping leading zero units.  Examples: 60 → "1h", 90 → "1h 30m",
// 1530 → "1d 1h 30m".
export const formatEventTime = (durationInMinutes) => {
  const days = Math.floor(durationInMinutes / (24 * 60));
  const hours = Math.floor((durationInMinutes % (24 * 60)) / 60);
  const minutes = durationInMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return parts.join(' ');
}