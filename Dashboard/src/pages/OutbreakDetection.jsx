import React, { useEffect, useMemo, useState } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, DateTime, Legend, Tooltip, ColumnSeries } from '@syncfusion/ej2-react-charts';
import { useStateContext } from '../contexts/ContextProvider';

const diseaseOptions = ['cholera', 'diarrhea', 'typhoid', 'hepatitis A'];

const getMockOutbreakData = async (disease) => {
  await new Promise((resolve) => { setTimeout(resolve, 300); });
  const now = new Date();
  const days = 30;
  const timeSeries = Array.from({ length: days }).map((unused, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - 1 - i));
    const base = 10 + Math.floor(8 * Math.sin(i / 5)) + Math.floor(Math.random() * 6);
    return { x: d, cases: base, symptoms: base + Math.floor(Math.random() * 5), turbidity: 2 + Math.random() * 4 };
  });
  const riskScore = Math.min(95, 40 + Math.floor(Math.random() * 60));
  const hotspots = [
    { name: 'Village A', predictedCases: 24 },
    { name: 'Village B', predictedCases: 18 },
    { name: 'Village C', predictedCases: 11 },
  ];
  const summary = {
    villagesReporting: 12 + Math.floor(Math.random() * 6),
    suspectedOutbreaks: 1 + Math.floor(Math.random() * 4),
    unsafeSources: 3 + Math.floor(Math.random() * 5),
  };
  return { disease, riskScore, timeSeries, hotspots, summary };
};

const OutbreakDetection = () => {
  const { currentMode, currentColor } = useStateContext();
  const [disease, setDisease] = useState('cholera');
  const [data, setData] = useState(null);
  const [reportForm, setReportForm] = useState({ village: '', symptoms: '', waterSource: '' });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getMockOutbreakData(disease).then((d) => {
      setData(d);
      const randomVillage = ['Village A', 'Village B', 'Village C'][Math.floor(Math.random() * 3)];
      const newAlert = `High Risk: ${d.disease} in ${randomVillage}`;
      setAlerts((prev) => [newAlert, ...prev].slice(0, 3));
    });
  }, [disease]);

  const casesSeries = useMemo(() => (data ? data.timeSeries.map((p) => ({ x: p.x, y: p.cases })) : []), [data]);
  const symptomsSeries = useMemo(() => (data ? data.timeSeries.map((p) => ({ x: p.x, y: p.symptoms })) : []), [data]);
  const turbiditySeries = useMemo(() => (data ? data.timeSeries.map((p) => ({ x: p.x, y: p.turbidity })) : []), [data]);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('manualReports') || '[]');
    const newItem = { id: Date.now(), ...reportForm, disease };
    localStorage.setItem('manualReports', JSON.stringify([newItem, ...items]));
    setReportForm({ village: '', symptoms: '', waterSource: '' });
    setAlerts((prev) => [`New Report: ${newItem.village} (${newItem.disease})`, ...prev].slice(0, 3));
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-6 bg-white dark:bg-secondary-dark-bg rounded-3xl shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Outbreak Detection</h2>
          <p className="text-gray-500">Monitoring water-borne disease risks</p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="disease" className="text-sm text-gray-600">Disease</label>
          <select id="disease" className="border rounded px-3 py-1.5 dark:bg-main-dark-bg" value={disease} onChange={(e) => setDisease(e.target.value)}>
            {diseaseOptions.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
        </div>
      </div>

      {data && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-gray-700/40">
            <p className="text-gray-500">Outbreak Risk</p>
            <p className="text-3xl font-bold" style={{ color: currentColor }}>{data.riskScore}%</p>
            <p className="text-xs text-gray-400">e.g., risk of {disease} outbreak</p>
          </div>
          <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-gray-700/40">
            <p className="text-gray-500">Villages Reporting</p>
            <p className="text-2xl font-semibold">{data.summary.villagesReporting}</p>
          </div>
          <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-gray-700/40">
            <p className="text-gray-500">Suspected Outbreaks</p>
            <p className="text-2xl font-semibold">{data.summary.suspectedOutbreaks}</p>
          </div>
          <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-gray-700/40">
            <p className="text-gray-500">Unsafe Water Sources</p>
            <p className="text-2xl font-semibold">{data.summary.unsafeSources}</p>
          </div>
        </div>
      )}

      {/* Alerts banner */}
      <div className="mt-6 rounded-xl p-4" style={{ backgroundColor: currentColor }}>
        <p className="text-white font-semibold">Alerts</p>
        <ul className="mt-2 text-white/90 text-sm list-disc ml-5">
          {alerts.length === 0 ? <li>No alerts</li> : alerts.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>

      {/* Trends charts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-gray-700/40 lg:col-span-2">
          <h3 className="font-semibold mb-2">Cases & Symptoms (last 30 days)</h3>
          <ChartComponent id="cases-chart" height="320px" primaryXAxis={{ valueType: 'DateTime' }} primaryYAxis={{}} chartArea={{ border: { width: 0 } }} tooltip={{ enable: true }} background={currentMode === 'Dark' ? '#33373E' : '#fff'}>
            <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
            <SeriesCollectionDirective>
              <SeriesDirective type="Line" name="Cases" xName="x" yName="y" dataSource={casesSeries} width={2} />
              <SeriesDirective type="Line" name="Symptoms" xName="x" yName="y" dataSource={symptomsSeries} width={2} />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
        <div className="bg-white dark:bg-main-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-gray-700/40">
          <h3 className="font-semibold mb-2">Water Quality (turbidity)</h3>
          <ChartComponent id="water-chart" height="320px" primaryXAxis={{ valueType: 'DateTime' }} primaryYAxis={{}} chartArea={{ border: { width: 0 } }} tooltip={{ enable: true }} background={currentMode === 'Dark' ? '#33373E' : '#fff'}>
            <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
            <SeriesCollectionDirective>
              <SeriesDirective type="Line" name="Turbidity" xName="x" yName="y" dataSource={turbiditySeries} width={2} />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>

      {/* Hotspots */}
      <div className="mt-6 bg-white dark:bg-main-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-gray-700/40">
        <h3 className="font-semibold mb-2">Geographical Hotspots (predicted cases)</h3>
        <ChartComponent id="hotspots-chart" height="320px" primaryXAxis={{ valueType: 'Category' }} primaryYAxis={{}} chartArea={{ border: { width: 0 } }} tooltip={{ enable: true }} background={currentMode === 'Dark' ? '#33373E' : '#fff'}>
          <Inject services={[ColumnSeries, Legend, Tooltip]} />
          <SeriesCollectionDirective>
            <SeriesDirective type="Column" name="Predicted Cases" xName="name" yName="predictedCases" dataSource={data?.hotspots || []} columnSpacing={0.2} />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>

      {/* Manual reporting form */}
      <div className="mt-6 bg-white dark:bg-main-dark-bg rounded-2xl p-4 border border-gray-100 dark:border-gray-700/40">
        <h3 className="font-semibold mb-3">Report a Case</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleReportSubmit}>
          <label htmlFor="village" className="sr-only">Village name</label>
          <input id="village" className="border rounded px-3 py-2 dark:bg-main-dark-bg" placeholder="Village name" value={reportForm.village} onChange={(e) => setReportForm({ ...reportForm, village: e.target.value })} />
          <label htmlFor="symptoms" className="sr-only">Symptoms</label>
          <input id="symptoms" className="border rounded px-3 py-2 dark:bg-main-dark-bg" placeholder="Symptoms" value={reportForm.symptoms} onChange={(e) => setReportForm({ ...reportForm, symptoms: e.target.value })} />
          <label htmlFor="waterSource" className="sr-only">Water source</label>
          <input id="waterSource" className="border rounded px-3 py-2 dark:bg-main-dark-bg" placeholder="Water source" value={reportForm.waterSource} onChange={(e) => setReportForm({ ...reportForm, waterSource: e.target.value })} />
          <div className="md:col-span-3">
            <button type="submit" className="text-white px-4 py-2 rounded" style={{ backgroundColor: currentColor }}>Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutbreakDetection;

