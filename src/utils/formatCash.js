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
