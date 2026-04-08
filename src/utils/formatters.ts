const UNITS = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

export function formatMoney(n: number): string {
  if (!isFinite(n)) return '∞';
  if (n < 1000) return '$' + Math.floor(n).toString();
  const tier = Math.floor(Math.log10(Math.abs(n)) / 3);
  const unit = UNITS[tier] ?? 'e' + tier * 3;
  const scaled = n / Math.pow(10, tier * 3);
  return '$' + scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0) + unit;
}

export function formatNumber(n: number): string {
  return formatMoney(n).replace('$', '');
}

export function formatTime(sec: number): string {
  if (sec < 1) return (sec * 1000).toFixed(0) + 'ms';
  if (sec < 60) return sec.toFixed(1) + 's';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
