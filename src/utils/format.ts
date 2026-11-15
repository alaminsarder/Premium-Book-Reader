export const formatBDT = (amount: number): string =>
  `৳${Math.round(amount).toLocaleString('en-IN')}`;