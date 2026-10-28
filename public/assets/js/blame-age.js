// GitHub's blame colours each hunk's age bar on a scale of ten from the file's oldest commit to its newest. Forgejo
// renders each hunk's date in its first row, so this reads those dates and gives every row of the hunk its step.
(() => {
  const hunks = [];
  let hunk;
  for (const row of document.querySelectorAll(".theme-blame .code-view tr")) {
    const time = row.querySelector(".blame-time [datetime]");
    if (time) {
      hunk = { time: Date.parse(time.getAttribute("datetime")), rows: [] };
      hunks.push(hunk);
    }
    hunk?.rows.push(row);
  }
  const dated = hunks.filter(({ time }) => Number.isFinite(time));
  if (!dated.length) return;
  const oldest = dated.reduce((min, { time }) => Math.min(min, time), Infinity);
  const newest = dated.reduce((max, { time }) => Math.max(max, time), -Infinity);
  for (const { time, rows } of dated) {
    const step = newest === oldest ? 10 : 1 + Math.round((9 * (time - oldest)) / (newest - oldest));
    for (const row of rows) row.style.setProperty("--theme-blame-age", `${10 + step * 9}%`);
  }
})();
