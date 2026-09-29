import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Sliders, FileSpreadsheet, ArrowRight, RotateCcw, Download } from 'lucide-react';

type Dimension = 'countryNm' | 'regionNm' | 'sectorNm' | 'projectTypeNm' | 'stageNm' | 'startYear';
type Metric = 'count' | 'budgetAmt' | 'contractAmt' | 'executedAmt';

export const PivotStatsView: React.FC = () => {
  const { projects, exportToCsv } = useApp();

  const [rowDim, setRowDim] = useState<Dimension>('sectorNm');
  const [colDim, setColDim] = useState<Dimension>('regionNm');
  const [metric, setMetric] = useState<Metric>('budgetAmt');

  const dimLabels: Record<Dimension, string> = {
    countryNm: '수원국',
    regionNm: '권역',
    sectorNm: '분야 (도시/교통 등)',
    projectTypeNm: '사업유형',
    stageNm: '추진단계',
    startYear: '착수연도',
  };

  const metricLabels: Record<Metric, string> = {
    count: '사업 건수 (건)',
    budgetAmt: '예산 규모 (억원)',
    contractAmt: '계약 금액 (억원)',
    executedAmt: '집행 금액 (억원)',
  };

  // Pre-process projects with startYear
  const enrichedProjects = useMemo(() => {
    return projects.map((p) => ({
      ...p,
      startYear: `${p.startYmd.slice(0, 4)}년`,
      contractAmt: p.budget?.contractAmt || 0,
      executedAmt: p.budget?.executedAmt || 0,
    }));
  }, [projects]);

  // Compute Distinct Values for Rows and Cols
  const { rowKeys, colKeys, matrix, rowTotals, colTotals, grandTotal } = useMemo(() => {
    const rSet = new Set<string>();
    const cSet = new Set<string>();

    enrichedProjects.forEach((p) => {
      rSet.add(String(p[rowDim] || '기타'));
      cSet.add(String(p[colDim] || '기타'));
    });

    const rKeys = Array.from(rSet).sort();
    const cKeys = Array.from(cSet).sort();

    const mat: Record<string, Record<string, number>> = {};
    const rTot: Record<string, number> = {};
    const cTot: Record<string, number> = {};
    let gTot = 0;

    rKeys.forEach((r) => {
      mat[r] = {};
      rTot[r] = 0;
      cKeys.forEach((c) => {
        mat[r][c] = 0;
      });
    });
    cKeys.forEach((c) => {
      cTot[c] = 0;
    });

    enrichedProjects.forEach((p) => {
      const rVal = String(p[rowDim] || '기타');
      const cVal = String(p[colDim] || '기타');

      let val = 1;
      if (metric === 'budgetAmt') val = p.budgetAmt / 100000000;
      else if (metric === 'contractAmt') val = p.contractAmt / 100000000;
      else if (metric === 'executedAmt') val = p.executedAmt / 100000000;

      mat[rVal][cVal] += val;
      rTot[rVal] += val;
      cTot[cVal] += val;
      gTot += val;
    });

    return {
      rowKeys: rKeys,
      colKeys: cKeys,
      matrix: mat,
      rowTotals: rTot,
      colTotals: cTot,
      grandTotal: gTot,
    };
  }, [enrichedProjects, rowDim, colDim, metric]);

  // Chart data from row totals
  const chartData = useMemo(() => {
    return rowKeys.map((r) => ({
      name: r,
      val: Number(rowTotals[r].toFixed(1)),
    }));
  }, [rowKeys, rowTotals]);

  const handleExportPivot = () => {
    const rows = rowKeys.map((r) => {
      const rowObj: any = { [dimLabels[rowDim]]: r };
      colKeys.forEach((c) => {
        rowObj[c] = Number(matrix[r][c].toFixed(1));
      });
      rowObj['합계'] = Number(rowTotals[r].toFixed(1));
      return rowObj;
    });
    exportToCsv(rows, `국토교통_ODA_동적피봇_${rowDim}_X_${colDim}`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>DYNAMIC MULTIDIMENSIONAL PIVOT GRID</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">통계 및 동적 피봇 분석 (F-150 ~ F-154)</h1>
            <p className="text-xs text-slate-500 mt-1">
              행(Row), 열(Column) 차원 및 집계 지표(Metric)를 자유롭게 변경하여 국토교통 ODA 다차원 교차 분석을 수행합니다.
            </p>
          </div>

          <button
            onClick={handleExportPivot}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>피봇 분석 결과 엑셀 다운로드 (F-154)</span>
          </button>
        </div>

        {/* Dynamic Controls */}
        <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-slate-700 font-bold mb-1">
              1. 행(Row) 차원 선택
            </label>
            <select
              value={rowDim}
              onChange={(e) => setRowDim(e.target.value as Dimension)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
            >
              {Object.entries(dimLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-slate-700 font-bold mb-1">
              2. 열(Column) 차원 선택
            </label>
            <select
              value={colDim}
              onChange={(e) => setColDim(e.target.value as Dimension)}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
            >
              {Object.entries(dimLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
            <label className="block text-blue-900 font-bold mb-1">
              3. 집계 지표(Metric)
            </label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as Metric)}
              className="w-full p-2 border border-blue-300 rounded-lg bg-white font-bold text-blue-950"
            >
              {Object.entries(metricLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Pivot Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="font-bold text-slate-900 flex items-center space-x-2">
            <span>[행: {dimLabels[rowDim]}] × [열: {dimLabels[colDim]}]</span>
            <span className="text-blue-700">({metricLabels[metric]})</span>
          </div>
          <span className="text-slate-500 font-mono">
            총합계: {grandTotal.toFixed(1)} {metric === 'count' ? '건' : '억원'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3 bg-slate-200/70 border-r border-slate-200 font-bold">
                  {dimLabels[rowDim]} \ {dimLabels[colDim]}
                </th>
                {colKeys.map((c) => (
                  <th key={c} className="p-3 text-right border-r border-slate-200">
                    {c}
                  </th>
                ))}
                <th className="p-3 text-right bg-blue-50 text-blue-900 font-bold">
                  행 합계
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rowKeys.map((r) => (
                <tr key={r} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-slate-800 bg-slate-50/50 border-r border-slate-200">
                    {r}
                  </td>
                  {colKeys.map((c) => {
                    const val = matrix[r][c];
                    return (
                      <td key={c} className="p-3 text-right font-mono text-slate-700 border-r border-slate-100">
                        {val > 0 ? (metric === 'count' ? val.toLocaleString() : Number(val.toFixed(1)).toLocaleString()) : '-'}
                      </td>
                    );
                  })}
                  <td className="p-3 text-right font-mono font-bold text-blue-950 bg-blue-50/30">
                    {metric === 'count' ? rowTotals[r].toLocaleString() : Number(rowTotals[r].toFixed(1)).toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* Column Totals Row */}
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td className="p-3 bg-slate-200 border-r border-slate-200">열 합계</td>
                {colKeys.map((c) => (
                  <td key={c} className="p-3 text-right font-mono border-r border-slate-200">
                    {metric === 'count' ? colTotals[c].toLocaleString() : Number(colTotals[c].toFixed(1)).toLocaleString()}
                  </td>
                ))}
                <td className="p-3 text-right font-mono font-black text-blue-900 bg-blue-100/60">
                  {metric === 'count' ? grandTotal.toLocaleString() : Number(grandTotal.toFixed(1)).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto Recharts Visualization (F-153) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {dimLabels[rowDim]} 기준 {metricLabels[metric]} 시각화 (F-153)
            </h3>
            <p className="text-[11px] text-slate-500">동적 피봇 설정에 따라 실시간 렌더링됩니다.</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip
                formatter={(val: any) => [`${val} ${metric === 'count' ? '건' : '억원'}`, metricLabels[metric]]}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="val" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
