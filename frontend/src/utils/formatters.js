/**
 * Format a numeric value as USD currency.
 * Handles null/undefined/NaN gracefully.
 */
export const formatPrice = (value) => {
  const num = Number(value);
  if (isNaN(num)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format a date string or Date object into a readable short date.
 */
export const formatDate = (dateValue) => {
  if (!dateValue) return '—';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date as relative time (e.g. "2 hours ago").
 */
export const formatRelativeTime = (dateValue) => {
  if (!dateValue) return '—';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return '—';
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)  return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)     return `${days}d ago`;
  return formatDate(dateValue);
};

/**
 * Get initials from first and last name.
 */
export const getInitials = (firstName = '', lastName = '') =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

/**
 * Truncate a string to a max length with ellipsis.
 */
export const truncate = (str, max = 80) => {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max).trimEnd()}…` : str;
};
