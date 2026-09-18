type SeriesPoint = { total: number | string; date: string };

/**
 * Period-over-period change for an analytics series.
 *
 * Every provider used to return a hardcoded `percentageChange: 5`, so the
 * analytics cards showed a green "5.0%" on everything - including on metrics
 * sitting at 0, where a rise is not even arithmetically possible. Compare the
 * newer half of the window against the older half of the same length instead,
 * and return 0 whenever there is nothing to compare against: fewer than two
 * points, or an older half that is entirely zero (any change from zero is
 * infinite, not a percentage). TrendIndicator renders nothing on 0, so
 * "we don't know" now shows nothing rather than a number we invented.
 */
export const percentageChange = (data?: SeriesPoint[] | null): number => {
  if (!Array.isArray(data) || data.length < 2) {
    return 0;
  }

  const totals = data.map((point) => Number(point?.total) || 0);
  // equal-length halves, so an odd number of points cannot bias the result
  const half = Math.floor(totals.length / 2);
  const sum = (values: number[]) => values.reduce((all, one) => all + one, 0);
  const older = sum(totals.slice(0, half));
  const newer = sum(totals.slice(-half));

  if (older === 0) {
    return 0;
  }

  return Math.round(((newer - older) / Math.abs(older)) * 1000) / 10;
};
