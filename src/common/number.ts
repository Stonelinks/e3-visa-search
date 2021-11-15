export const isNumeric = (value: string) => {
  return /^-{0,1}\d+$/.test(value);
};

export const isPositiveNumeric = (value: string) => {
  return /^\d+$/.test(value);
};

export const median = (n: number[]) => {
  if (n.length === 0) return 0;

  n.sort((a, b) => {
    return a - b;
  });

  const half = Math.floor(n.length / 2);

  if (n.length % 2) return n[half];

  return (n[half - 1] + n[half]) / 2.0;
};

export const formatNumber = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const parseCurrencyStr = (s: string) =>
  Number(s.replace(/[^0-9.-]+/g, ""));
