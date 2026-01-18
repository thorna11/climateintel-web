export async function loadWindJson() {
  const [summary, timeseries, accuracy, parameters] = await Promise.all([
    fetch("/data/wind/wind_summary.json").then(r => r.json()),
    fetch("/data/wind/wind_timeseries.json").then(r => r.json()),
    fetch("/data/wind/wind_accuracy.json").then(r => r.json()),
    fetch("/data/wind/wind_parameters.json").then(r => r.json()),
  ]);

  return { summary, timeseries, accuracy, parameters };
}
