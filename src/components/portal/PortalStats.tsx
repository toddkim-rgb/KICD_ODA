import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, Download, PieChart as PieIcon, FileSpreadsheet, TrendingUp, Layers } from 'lucide-react';

const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export const PortalStats: React.FC = () => {
  const { projects, exportToCsv } = useApp();

  const publicProjects = projects.filter((p) => p.isPublic === 'Y');

  // 1. Sector Stats
  const sectorData = useMemo(() => {
    const map: Record<string, { count: number; budget: number }> = {};
    publicProjects.forEach((p) => {
      if (!map[p.sectorNm]) {
        map[p.sectorNm] = { count: 0, budget: 0 };
      }
      map[p.sectorNm].count += 1;
      map[p.sectorNm].budget += p.budgetAmt;
    });

    return Object.entries(map).map(([name, val]) => ({
      name,
      count: val.count,
      budgetEok: Math.round(val.budget / 100000000),
    }));
  }, [publicProjects]);

  // 2. Region Stats (Pie)
  const regionData = useMemo(() => {
    const map: Record<string, number> = {};
    publicProjects.forEach((p) => {
      map[p.regionNm] = (map[p.regionNm] || 0) + p.budgetAmt;
    });

    return Object.entries(map).map(([name, val]) => ({
      name,
      value: Math.round(val / 100000000),
    }));
  }, [publicProjects]);

  // 3. Yearly Trends
  const yearlyData = useMemo(() => {
    const map: Record<number, { count: number; budget: number }> = {};
    publicProjects.forEach((p) => {
      const yr = parseInt(p.startYmd.slice(0, 4), 10) || 2024;
      if (!map[yr]) {
        map[yr] = { count: 0, budget: 0 };
      }
      map[yr].count += 1;
      map[yr].budget += p.budgetAmt;
    });

    return Object.entries(map)
      .map(([yr, val]) => ({
        year: `${yr}년`,
        count: val.count,
        budgetEok: Math.round(val.budget / 100000000),
      }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [publicProjects]);

  const handleExportStats = () => {
    const rows = sectorData.map((s) => ({
      분야: s.name,
      추진사업수: s.count,
      지원예산_억원: s.budgetEok,
    }));
    exportToCsv(rows, '국토교통_ODA_분야별_통계');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>OFFICIAL ODA STATISTICAL DASHBOARD</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">국토교통 ODA 사업 통계</h1>
            <p className="text-xs text-slate-500 mt-1">
              국가별, 권역별, 분야별, 연도별 사업 추진현황 및 예산 규모 통계를 시각화 차트와 표 형태로 제공합니다.
            </p>
          </div>
          <button
            onClick={handleExportStats}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>통계 데이터 엑셀 다운로드</span>
          </button>
        </div>
      </div>

      {/* Visual Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Budget Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">6대 국토교통 분야별 예산 규모</h2>
              <p className="text-[11px] text-slate-500">도시, 교통, 공간정보 등 분야별 투입 예산 (단위: 억원)</p>
            </div>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} 억원`, '지원 예산']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="budgetEok" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region Distribution Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">대륙 및 권역별 ODA 예산 비중</h2>
              <p className="text-[11px] text-slate-500">동남아, 중앙아시아, 중남미 등 권역별 분포 비율</p>
            </div>
            <PieIcon className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {regionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} 억원`, '예산 규모']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-700">{value}</span>}
                  layout="horizontal"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">연도별 착수 과제 수 및 예산 규모 추이</h2>
              <p className="text-[11px] text-slate-500">연도별 신규 국토교통 ODA 착수 규모 (단위: 억원)</p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} 억원`, '예산액']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="budgetEok" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-900">분야별 통계 종합 집계표</h3>
          <span className="text-[11px] text-slate-500">국제개발협력센터 ODA 사업DB 기준</span>
        </div>
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">분야명</th>
              <th className="p-3 text-right">사업 건수</th>
              <th className="p-3 text-right">총 예산 (억원)</th>
              <th className="p-3 text-right">과제당 평균 예산 (억원)</th>
              <th className="p-3 text-right">전체 대비 비중</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sectorData.map((s) => {
              const totalBudgetAll = sectorData.reduce((acc, c) => acc + c.budgetEok, 0);
              const pct = totalBudgetAll > 0 ? ((s.budgetEok / totalBudgetAll) * 100).toFixed(1) : '0';
              const avg = s.count > 0 ? (s.budgetEok / s.count).toFixed(1) : '0';
              return (
                <tr key={s.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-bold text-slate-800">{s.name}</td>
                  <td className="p-3 text-right font-mono">{s.count}건</td>
                  <td className="p-3 text-right font-mono font-bold text-blue-900">{s.budgetEok.toLocaleString()} 억원</td>
                  <td className="p-3 text-right font-mono text-slate-600">{Number(avg).toLocaleString()} 억원</td>
                  <td className="p-3 text-right font-mono text-emerald-700 font-semibold">{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
